"use client";

// Browser-only board store for guests: same hook API as Liveblocks,
// no network calls, persisted in localStorage.
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { History, LiveList, LiveMap, LiveObject } from "@liveblocks/client";

import { Layer } from "@/types/canvas";
import {
  BoardHooks,
  BoardHooksProvider,
  BoardPresence,
  BoardRoot,
  BoardStorage,
  BoardUser,
  MutationCtx,
} from "@/lib/board-hooks";

const STORAGE_KEY = "collaboard:guest-board";
const MAX_HISTORY = 100;

export type GuestBoardData = {
  layerIds: string[];
  layers: Record<string, Layer>;
};

export const readGuestBoard = (): GuestBoardData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GuestBoardData;
    if (!Array.isArray(data.layerIds) || typeof data.layers !== "object") return null;
    return data;
  } catch {
    return null;
  }
};

export const clearGuestBoard = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

const writeGuestBoard = (data: GuestBoardData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const toData = (root: BoardRoot): GuestBoardData => ({
  layerIds: [...root.layerIds],
  layers: Object.fromEntries(root.layers) as Record<string, Layer>,
});

const buildRoot = (data: GuestBoardData | null) => {
  const ids = (data?.layerIds ?? []).filter((id) => data?.layers[id]);
  return new LiveObject<BoardStorage>({
    layers: new LiveMap(ids.map((id) => [id, new LiveObject(data!.layers[id])])),
    layerIds: new LiveList(ids),
  });
};

type HistoryEntry = { storage: BoardRoot; selection: string[] };
type State = { storage: BoardRoot; presence: BoardPresence };

class LocalBoardStore {
  private root: LiveObject<BoardStorage>;
  private listeners = new Set<() => void>();
  private past: HistoryEntry[] = [];
  private future: HistoryEntry[] = [];
  private paused = false;
  private pausedEntry: HistoryEntry | null = null;
  private depth = 0;
  private batchStart: HistoryEntry | null = null;
  private batchHistory = false;
  private saveTimer: ReturnType<typeof setTimeout> | undefined;
  private selfCache: { presence: BoardPresence; user: BoardUser } | null = null;
  state: State;

  constructor(data: GuestBoardData | null) {
    this.root = buildRoot(data);
    this.state = {
      storage: this.root.toImmutable(),
      presence: { cursor: null, selection: [], pencilDraft: null, penColor: null },
    };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  self(): BoardUser {
    const { presence } = this.state;
    if (this.selfCache?.presence !== presence) {
      this.selfCache = {
        presence,
        user: {
          connectionId: 0,
          id: "guest",
          info: { name: "Guest" },
          presence,
          canWrite: true,
          canComment: false,
        } as BoardUser,
      };
    }
    return this.selfCache.user;
  }

  private entry(): HistoryEntry {
    return { storage: this.state.storage, selection: this.state.presence.selection };
  }

  // Runs a mutation; nested mutations are batched into one history step, like Liveblocks
  mutate<A extends unknown[], R>(callback: (ctx: MutationCtx, ...args: A) => R, args: A): R {
    if (this.depth++ === 0) {
      this.batchStart = this.entry();
      this.batchHistory = false;
    }
    try {
      return callback(
        {
          storage: this.root,
          self: this.self(),
          others: [],
          setMyPresence: (patch, options) => {
            this.state = { ...this.state, presence: { ...this.state.presence, ...patch } };
            if (options?.addToHistory) this.batchHistory = true;
          },
        },
        ...args
      );
    } finally {
      if (--this.depth === 0) this.commit();
    }
  }

  private commit() {
    const storage = this.root.toImmutable();
    const changed = storage !== this.batchStart!.storage;
    if (changed || this.batchHistory) this.record(this.batchStart!);
    this.batchStart = null;
    this.state = { ...this.state, storage };
    if (changed) this.scheduleSave();
    this.emit();
  }

  private record(entry: HistoryEntry) {
    this.future = [];
    if (this.paused) {
      this.pausedEntry ??= entry;
      return;
    }
    this.past.push(entry);
    if (this.past.length > MAX_HISTORY) this.past.shift();
  }

  private restore(entry: HistoryEntry) {
    this.root = buildRoot(toData(entry.storage));
    const storage = this.root.toImmutable();
    const selection = entry.selection.filter((id) => storage.layers.has(id));
    this.state = { storage, presence: { ...this.state.presence, selection } };
    this.scheduleSave();
    this.emit();
  }

  private scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => writeGuestBoard(toData(this.state.storage)), 300);
  }

  canUndo = () => this.past.length > 0;
  canRedo = () => this.future.length > 0;

  history: History = {
    undo: () => {
      const entry = this.past.pop();
      if (!entry) return;
      this.future.push(this.entry());
      this.restore(entry);
    },
    redo: () => {
      const entry = this.future.pop();
      if (!entry) return;
      this.past.push(this.entry());
      this.restore(entry);
    },
    canUndo: () => this.canUndo(),
    canRedo: () => this.canRedo(),
    clear: () => {
      this.past = [];
      this.future = [];
      this.emit();
    },
    pause: () => {
      this.paused = true;
    },
    resume: () => {
      this.paused = false;
      if (this.pausedEntry) {
        this.past.push(this.pausedEntry);
        this.pausedEntry = null;
        this.emit();
      }
    },
  };
}

const LocalStoreContext = createContext<LocalBoardStore | null>(null);

const useStore = () => {
  const store = useContext(LocalStoreContext);
  if (!store) throw new Error("Missing LocalRoom");
  return store;
};

const NONE = Symbol("none");
const EMPTY: never[] = [];

// Subscribes to the store and keeps the previous result while isEqual says it's unchanged
const useSelected = <T,>(
  select: (store: LocalBoardStore) => T,
  isEqual: (prev: T, curr: T) => boolean = Object.is
): T => {
  const store = useStore();
  const last = useRef<T | typeof NONE>(NONE);
  const getSnapshot = () => {
    const next = select(store);
    if (last.current !== NONE && isEqual(last.current, next)) return last.current;
    last.current = next;
    return next;
  };
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
};

const localHooks: BoardHooks = {
  useStorage: (selector, isEqual) =>
    useSelected((store) => selector(store.state.storage), isEqual),
  useSelf: (selector, isEqual) => useSelected((store) => selector(store.self()), isEqual),
  useOthers: () => EMPTY,
  useOthersMapped: () => EMPTY,
  useOthersConnectionIds: () => EMPTY,
  useOther: () => {
    throw new Error("No other users on a guest board");
  },
  useMutation: (callback, deps) => {
    const store = useStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const run = useCallback((...args: never[]) => store.mutate(callback, args), [store, ...deps]);
    return run as never;
  },
  useHistory: () => useStore().history,
  useCanUndo: () => useSelected((store) => store.canUndo()),
  useCanRedo: () => useSelected((store) => store.canRedo()),
};

interface LocalRoomProps {
  children: ReactNode;
  fallback: ReactNode;
}

export const LocalRoom = ({ children, fallback }: LocalRoomProps) => {
  // Created after mount: localStorage isn't available during server rendering
  const [store, setStore] = useState<LocalBoardStore | null>(null);

  useEffect(() => {
    setStore(new LocalBoardStore(readGuestBoard()));
  }, []);

  if (!store) return fallback;

  return (
    <LocalStoreContext.Provider value={store}>
      <BoardHooksProvider value={localHooks}>{children}</BoardHooksProvider>
    </LocalStoreContext.Provider>
  );
};

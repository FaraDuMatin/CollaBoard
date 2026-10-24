"use client";

// Board hooks used by the canvas. Real boards use Liveblocks (default);
// the guest board swaps in a local, browser-only store via BoardHooksProvider.
import { createContext, useContext } from "react";
import type { History, LiveObject, User } from "@liveblocks/client";
import * as live from "@liveblocks/react/suspense";

export type BoardStorage = Liveblocks["Storage"];
export type BoardPresence = Liveblocks["Presence"];
export type BoardRoot = ReturnType<LiveObject<BoardStorage>["toImmutable"]>;
export type BoardUser = User<BoardPresence, Liveblocks["UserMeta"]>;

export type MutationCtx = {
  storage: LiveObject<BoardStorage>;
  self: BoardUser;
  others: readonly BoardUser[];
  setMyPresence: (
    patch: Partial<BoardPresence>,
    options?: { addToHistory: boolean }
  ) => void;
};

type MutationFn = (ctx: MutationCtx, ...args: never[]) => unknown;
type OmitFirstArg<F> = F extends (first: never, ...rest: infer A) => infer R
  ? (...args: A) => R
  : never;
type IsEqual<T> = (prev: T, curr: T) => boolean;

export interface BoardHooks {
  useStorage<T>(selector: (root: BoardRoot) => T, isEqual?: IsEqual<T>): T;
  useSelf<T>(selector: (me: BoardUser) => T, isEqual?: IsEqual<T>): T;
  useOthers(): readonly BoardUser[];
  useOthersMapped<T>(
    selector: (other: BoardUser) => T
  ): ReadonlyArray<readonly [connectionId: number, data: T]>;
  useOthersConnectionIds(): readonly number[];
  useOther<T>(connectionId: number, selector: (other: BoardUser) => T): T;
  useMutation<F extends MutationFn>(callback: F, deps: readonly unknown[]): OmitFirstArg<F>;
  useHistory(): History;
  useCanUndo(): boolean;
  useCanRedo(): boolean;
}

const liveHooks = {
  useStorage: live.useStorage,
  useSelf: live.useSelf,
  useOthers: live.useOthers,
  useOthersMapped: live.useOthersMapped,
  useOthersConnectionIds: live.useOthersConnectionIds,
  useOther: live.useOther,
  useMutation: live.useMutation,
  useHistory: live.useHistory,
  useCanUndo: live.useCanUndo,
  useCanRedo: live.useCanRedo,
} as unknown as BoardHooks;

const BoardHooksContext = createContext<BoardHooks>(liveHooks);
export const BoardHooksProvider = BoardHooksContext.Provider;

const identity = <T,>(value: T) => value;

export const useStorage: BoardHooks["useStorage"] = (selector, isEqual) =>
  useContext(BoardHooksContext).useStorage(selector, isEqual);

export function useSelf(): BoardUser;
export function useSelf<T>(selector: (me: BoardUser) => T, isEqual?: IsEqual<T>): T;
export function useSelf(
  selector: (me: BoardUser) => unknown = identity,
  isEqual?: IsEqual<unknown>
) {
  return useContext(BoardHooksContext).useSelf(selector, isEqual);
}

export const useOthers: BoardHooks["useOthers"] = () =>
  useContext(BoardHooksContext).useOthers();

export const useOthersMapped: BoardHooks["useOthersMapped"] = (selector) =>
  useContext(BoardHooksContext).useOthersMapped(selector);

export const useOthersConnectionIds: BoardHooks["useOthersConnectionIds"] = () =>
  useContext(BoardHooksContext).useOthersConnectionIds();

export const useOther: BoardHooks["useOther"] = (connectionId, selector) =>
  useContext(BoardHooksContext).useOther(connectionId, selector);

export const useMutation: BoardHooks["useMutation"] = (callback, deps) =>
  useContext(BoardHooksContext).useMutation(callback, deps);

export const useHistory: BoardHooks["useHistory"] = () =>
  useContext(BoardHooksContext).useHistory();

export const useCanUndo: BoardHooks["useCanUndo"] = () =>
  useContext(BoardHooksContext).useCanUndo();

export const useCanRedo: BoardHooks["useCanRedo"] = () =>
  useContext(BoardHooksContext).useCanRedo();

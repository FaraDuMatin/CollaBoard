"use client";
import { useOther } from "@liveblocks/react";
import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { User } from "lucide-react";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_PARTICIPANTS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length + 1 > MAX_SHOWN_PARTICIPANTS;

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-y-2">
        {users
          .slice(0, MAX_SHOWN_PARTICIPANTS)
          .map(({ connectionId, info }) => {
            return (
              <UserAvatar
                borderColor={connectionIdToColor(connectionId)}
                key={connectionId}
                src={info?.picture}
                name={info?.name}
                fallback={info?.name?.charAt(0) || "T"}
              />
            );
          })}

        {currentUser && (
          <UserAvatar
            borderColor={connectionIdToColor(currentUser.connectionId)}
            src={currentUser.info?.picture}
            name={currentUser.info?.name}
            fallback={currentUser.info?.name?.charAt(0) || "T"}
          />
        )}
        {hasMoreUsers && (
          <UserAvatar
            // borderColor={connectionIdToColor(currentUser.connectionId)}
            name={`${users.length - MAX_SHOWN_PARTICIPANTS} more`}
            fallback={`+${users.length - MAX_SHOWN_PARTICIPANTS}`}
          />
        )}
      </div>
      {/* <div className="ml-3 text-sm text-neutral-600 font-medium">
        {users.length + (currentUser ? 1 : 0)} participant
        {users.length + (currentUser ? 1 : 0) !== 1 ? "s" : ""}
      </div> */}
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-32"></div>
  );
};

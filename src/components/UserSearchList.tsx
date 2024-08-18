import type { User } from "@/types";
import { Spinner } from "@nextui-org/react";

import UserCard from "./UserCard";

export default function UserSearchList({
  query,
  users,
  ref,
}: {
  query: string;
  users: User[];
  ref: any;
}) {
  return (
    <div className="pr-10">
      <h1 className="text-[16px] font-semibold pb-3 pt-3">
        Search for: {query}
      </h1>

      <div>
        {users.length === 0 ? (
          <p>No results found</p>
        ) : (
          users?.map((recipe) => (
            <UserCard key={recipe._id?.toString()} user={recipe as User} />
          ))
        )}
        {(users ?? [])?.length > 0 && (users ?? [])?.length > 20 && (
          <div ref={ref}>
            <Spinner size="sm" className="mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}

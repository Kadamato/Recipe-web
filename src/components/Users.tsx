"use client";

import { useEffect, useState, useTransition } from "react";
import UserCard from "./UserCard";
import { getUserByName } from "@/lib/actions/recipe";
import type { User, UsersResponse } from "@/types";
import { Spinner } from "@nextui-org/react";

export default function Users({
  query,
  type,
}: {
  query: string;
  type: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const userList = (await getUserByName(query)) as UsersResponse;
        if (userList?.error) return setError("Không tìm thấy kết quả nào");
        setUsers((userList?.data ?? []) as User[]);
      } catch (error) {
        setError("Error occurred while fetching data");
      }
    });
  }, [query, type]);

  if (isPending) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="pr-10">
      <h1 className="text-[16px] font-semibold pb-5 pt-2">
        Tìm kiếm cho: {query}
      </h1>

      <div>
        {users.length === 0 ? (
          <p>Không tìm thấy kết quả nào</p>
        ) : (
          users.map((user) => <UserCard key={user._id} user={user} />)
        )}
      </div>
    </div>
  );
}

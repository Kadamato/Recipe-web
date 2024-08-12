"use server";

import { cookies } from "next/headers";
import { lucia } from "../auth/auth";

export default async function getSessionId() {
  return cookies().get(lucia!.sessionCookieName)?.value ?? null;
}

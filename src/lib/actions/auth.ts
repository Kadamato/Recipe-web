"use server";

import { cookies } from "next/headers";

import { generateCodeVerifier, generateState } from "arctic";
import { google } from "../auth/config";
import { redirect } from "next/navigation";
import { lucia, validateRequest } from "../auth/auth";

import { LogoutResponse } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";

async function createGoogleAuthorizationURL() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  try {
    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["profile", "email"],
    });

    cookies().set("googleState", state, {
      secure: false,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });

    cookies().set("googleCodeVerifier", codeVerifier, {
      secure: false,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });

    return {
      data: url.toString(),
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      error: err.message,
    };
  }
}

export async function login(): Promise<void> {
  const resp = await createGoogleAuthorizationURL();

  if (resp.error) {
    console.error(resp.error);
    return;
  }

  redirect(resp.data as string);
}

export async function logout(): Promise<LogoutResponse> {
  const cookieHeader = cookies();

  const sessionId =
    cookieHeader.get("auth_session")?.value ||
    cookieHeader.get(lucia?.sessionCookieName as string)?.value;
  const user = await validateRequest();

  if (!sessionId) {
    return { success: false, message: "No session to log out from." };
  }

  try {
    await lucia!.invalidateSession(sessionId);
    await lucia!.invalidateUserSessions(user!.id);
    if (lucia) {
      cookieHeader.delete(lucia.sessionCookieName);
    }


    //  reload page
    revalidatePath("/", "layout");

    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

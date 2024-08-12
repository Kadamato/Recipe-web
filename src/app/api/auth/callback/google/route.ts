import { v4 as uuidv4 } from "uuid";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { google } from "@/lib/auth/config";
import OAuthAccount from "@/models/OauthAccount";
import User from "@/models/User";
import { lucia } from "@/lib/auth/auth";

import { GoogleUser } from "@/types";

export async function GET(req: NextRequest) {
  const stateStored = cookies().get("googleState")?.value ?? "";
  const codeVerifierStored = cookies().get("googleCodeVerifier")?.value ?? "";

  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!stateStored || !codeVerifierStored || !state || !code)
    return Response.json({ error: "Invalid request" }, { status: 400 });

  if (state !== stateStored)
    return Response.json({ error: "Invalid state" }, { status: 400 });

  try {
    const validateCode = await google.validateAuthorizationCode(
      code,
      codeVerifierStored
    );

    if (!validateCode)
      return Response.json({ error: "Invalid code" }, { status: 400 });

    const { accessToken } = validateCode;

    const getUserInfo = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // read the user info
    const googleUser: GoogleUser = await getUserInfo.json();

    //  check if the user already exists

    const existingUser = await OAuthAccount.findOne({
      providerId: "google",
      providerUserId: googleUser.id,
    });

    if (existingUser) {
      const session = await lucia?.createSession(existingUser.userId, {});
      const sessionId = session?.id ?? null;
      const sessionCookie = sessionId
        ? lucia?.createSessionCookie(sessionId)
        : null;
      if (sessionCookie) {
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      return Response.redirect(new URL("/", req.url));
    }

    const id = uuidv4();

    let user = new User({
      username: googleUser.name,
      userId: id,
      email: googleUser.email,
      url: process.env.BASE_URL + "/users/" + id,
      gender: "male",
      type: "user",
      avatarUrl: googleUser.picture,
    });

    const newUser = await user.save();

    const { _id: userId } = newUser;

    const oauthAccount = new OAuthAccount({
      providerId: "google",
      providerUserId: googleUser.id,
      userId,
    });

    await oauthAccount.save();

    const session = await lucia?.createSession(userId, {});
    const sessionCookie = session
      ? lucia!.createSessionCookie(session.id)
      : null;

    cookies().set(
      sessionCookie!.name,
      sessionCookie!.value,
      sessionCookie!.attributes
    );
    //  save sessionId in local storage

    //  return home page
    return Response.redirect(new URL("/", req.url));
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

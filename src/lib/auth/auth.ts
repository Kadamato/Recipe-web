import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import initializeAdapter from "./adapter";

export let lucia: Lucia | null = null;

const initializeLucia = async () => {
  const adapter = await initializeAdapter();

  lucia = new Lucia(adapter, {
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        username: attributes.username,
        avatarUrl: attributes.avatarUrl,
        id: attributes._id,
        email: attributes.email,
        url: attributes.url,
      };
    },
  });
};

initializeLucia();

export const validateRequest = cache(async () => {
  if (!lucia) {
    await initializeLucia();
  }

  const sessionId = cookies().get(lucia!.sessionCookieName)?.value ?? null;

  if (!sessionId) return null;

  try {
    const { session, user } = await lucia!.validateSession(sessionId);

    if (session && session.fresh) {
      const sessionCookie = lucia!.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia!.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    return user;
  } catch (error: any) {
    console.log("validate_request", error);
    return null;
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  avatarUrl?: string;
  _id: string;
  email: string;
  url: string;
}

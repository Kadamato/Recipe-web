import { cookies } from "next/headers";

import { validateRequest } from "@/lib/auth/auth";
import { lucia } from "@/lib/auth/auth";

export async function GET(request: Request): Promise<void | Response> {
  const cookieHeader = cookies();

  const sessionId =
    cookieHeader.get("auth_session")?.value ||
    cookieHeader.get(lucia?.sessionCookieName as string)?.value;
  const user = await validateRequest();

  if (!sessionId) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No session to log out from.",
      }),
      { status: 400 }
    );
  }

  try {
    await lucia!.invalidateSession(sessionId);
    await lucia!.invalidateUserSessions(user!.id);
    if (lucia) {
      cookieHeader.delete(lucia.sessionCookieName);
    }

    //  revalidate

    return new Response(
      JSON.stringify({
        success: true,
        message: "Logged out",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
      }
    );
  }
}

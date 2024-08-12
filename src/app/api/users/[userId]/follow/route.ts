import { validateRequest } from "@/lib/auth/auth";
import followUserById from "@/lib/services/followUserById";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const owner = await validateRequest();
  const userId = params.userId;
  const ownerId = owner?.id ?? "";

  try {
    const followers = await followUserById(ownerId, userId);


    // if (!followers)
    //   return Response.json({ error: "Failed to follow user" }, { status: 400 });

    return Response.json(
      { followers },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

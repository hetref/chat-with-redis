"use server";

import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const checkAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false };

  const userId = `user:${user.id}`;
  const imgIsNull = user.picture?.includes("gravtar");
  const image = imgIsNull ? "" : user.picture;

  await redis.hset(userId, {
    id: user.id,
    email: user.email,
    name: `${user.given_name} ${user.family_name}`,
    image,
  });

  return { success: true };
};

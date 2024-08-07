"use server";

import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// {
//   user: {
//     email: 'contact@aryanshinde.in',
//     first_name: 'Contact',
//     id: 'kp_67a4cbba264d4a42bd60ca8673f4fc6b',
//     is_password_reset_requested: false,
//     is_suspended: false,
//     last_name: 'Aryan',
//     organizations: [ [Object] ],
//     phone: null,
//     username: null
//   }
// }

// {
//   user: {
//     email: 'devallyofficial@gmail.com',
//     first_name: 'DevAlly',
//     id: 'kp_601d190d41f4404390b1981036a479c1',
//     is_password_reset_requested: false,
//     is_suspended: false,
//     last_name: null,
//     organizations: [ [Object] ],
//     phone: null,
//     username: null
//   }
// }

export const checkAuthStatus = async ({
  user,
}: {
  user: {
    id: string;
    email: string;
    first_name: string | "";
    last_name: string | "";
  };
}) => {
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();

  // if (!user) return { success: false };

  const userId = `user:${user.id}`;
  // const imgIsNull = user.picture?.includes("gravtar");
  // const image = imgIsNull ? "" : user.picture;

  await redis.set(userId, {
    id: user.id,
    email: user.email,
    name: `${user?.first_name} ${user?.last_name}`,
    createdAt: new Date().toISOString(),
    // name: `${user.given_name} ${user.family_name}`,
    // image,
  });

  return { success: true };
};

import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { checkAuthStatus } from "@/actions/auth.actions";

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

interface KindeEvent extends jwt.JwtPayload {
  type: string;
  data: any;
}

export async function POST(req: Request) {
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded !== "object") {
      throw new Error("Invalid token");
    }
    const { header } = decoded;
    const { kid } = header;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = (await jwt.verify(token, signingKey)) as KindeEvent;

    // Handle various events
    switch (event?.type) {
      case "user.created":
        // handle user created event
        // e.g add user to database with event.data
        const authCreateResponse = await checkAuthStatus(event.data);
        if (!authCreateResponse.success) {
          console.log("User Creation Failed");
        } else {
          console.log("User Created Successfully");
        }
        console.log(event.data);
        break;
      default:
        // other events that we don't handle
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ status: 200, statusText: "success" });
}

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db
      .collection("users")
      .findOne({ email: session.user.email });

    const role = dbUser?.role || "Customer";
    const token = jwt.sign(
      {
        id: dbUser?._id?.toString() || session.user.id,
        email: session.user.email,
        role,
      },
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: {
        _id: dbUser?._id?.toString() || session.user.id,
        name: dbUser?.name || session.user.name,
        email: session.user.email,
        image: dbUser?.image || session.user.image || "",
        phone: dbUser?.phone || "",
        address: dbUser?.address || "",
        role,
      },
    });
  } catch (error) {
    console.error("JWT Route Error:", error);
    return NextResponse.json(
      { message: "Failed to generate JWT access token" },
      { status: 500 }
    );
  }
}

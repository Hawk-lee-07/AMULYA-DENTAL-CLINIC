import { NextRequest, NextResponse } from "next/server";
import { clinicConfig } from "@/config/clinicConfig";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (password === clinicConfig.adminPassword) {
      const response = NextResponse.json(
        { success: true, message: "Authentication successful." },
        { status: 200 }
      );

      // Set session cookie (7 days duration)
      response.cookies.set("amulya_admin_session", "authenticated", {
        path: "/",
        httpOnly: false, // accessible to client for quick state checks
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid admin password. Check src/config/clinicConfig.ts" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );

  response.cookies.set("amulya_admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

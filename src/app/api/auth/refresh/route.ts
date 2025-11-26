import { auth } from "@/lib/next-auth/auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.tokens?.refreshToken) {
      return NextResponse.json({ success: false, message: "No refresh token available" }, { status: 401 });
    }

    // Call the backend refresh endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
      {
        refreshToken: session.tokens.refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200 && response.data.success) {
      const { tokens } = response.data.data;

      return NextResponse.json({
        success: true,
        tokens,
      });
    }

    return NextResponse.json({ success: false, message: "Failed to refresh token" }, { status: 401 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Token refresh failed";
      return NextResponse.json({ success: false, message }, { status: error.response?.status || 401 });
    }

    return NextResponse.json({ success: false, message: "An error occurred during token refresh" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPayload } from "@cards/jwt";

export async function GET(request: NextRequest) {
  const headersList = headers();
  let bearer = headersList.get("Authorization");

  if (!bearer) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 401, statusText: "Forbidden" }
    );
  }

  if (bearer.substring(0, 6).toLowerCase() === "bearer") {
    bearer = bearer.substring(7);
  }

  const payload = getPayload(bearer);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 401, statusText: "Forbidden" }
    );
  }

  return NextResponse.json(payload);
}

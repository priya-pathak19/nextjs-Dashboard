import { start } from "workflow/api";
import { NextResponse } from "next/server";
import { handleUserSignup } from "@/actions/user-signup";

export async function POST(request: Request) {
  const { email } = await request.json();

  // Enqueues the workflow (does NOT wait for completion)
  await start(handleUserSignup, [email]);

  return NextResponse.json({
    message: "User signup workflow started",
  });
}

import { NextResponse } from "next/server";
import { createCaptchaToken, renderCaptchaSvg, verifyCaptchaToken } from "@/lib/auth/captcha";

export const runtime = "edge";

export async function GET() {
  const { code, token } = await createCaptchaToken();
  return NextResponse.json({ svg: renderCaptchaSvg(code), token });
}

export async function POST(request: Request) {
  const { token, answer } = (await request.json().catch(() => ({}))) as {
    token?: string;
    answer?: string;
  };
  const valid = await verifyCaptchaToken(token, answer);
  return NextResponse.json({ valid });
}

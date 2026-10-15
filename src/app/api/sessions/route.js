import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { makeCode, toPublicSession, validateSessionInput } from "@/lib/session";
import StudySession from "@/models/StudySession";

const unauthorized = () => NextResponse.json({ error: "Sign in to continue." }, { status: 401 });

// Sessions you host, newest start first.
export async function GET() {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.email) return unauthorized();
  await dbConnect();
  const docs = await StudySession.find({ hostEmail: auth.user.email }).sort({ startsAt: -1 }).limit(50).lean();
  return NextResponse.json({ sessions: docs.map(toPublicSession) });
}

export async function POST(request) {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.email) return unauthorized();

  const body = await request.json().catch(() => null);
  const result = validateSessionInput(body);
  if (!result.ok) return NextResponse.json({ errors: result.errors }, { status: 400 });

  await dbConnect();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const doc = await StudySession.create({
        ...result.value,
        code: makeCode(),
        hostEmail: auth.user.email,
        hostName: auth.user.name || "",
      });
      return NextResponse.json({ session: toPublicSession(doc) }, { status: 201 });
    } catch (error) {
      if (error?.code !== 11000) throw error; // retry only on a duplicate code
    }
  }
  return NextResponse.json({ error: "Couldn't create a session code. Try again." }, { status: 503 });
}

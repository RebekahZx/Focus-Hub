import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { parseCode, toPublicSession } from "@/lib/session";
import StudySession from "@/models/StudySession";

async function load(params) {
  const auth = await getServerSession(authOptions);
  if (!auth?.user?.email) return { response: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }) };
  const code = parseCode((await params).code);
  if (!code) return { response: NextResponse.json({ error: "That isn't a valid session code." }, { status: 404 }) };
  await dbConnect();
  const doc = await StudySession.findOne({ code }).lean();
  if (!doc) return { response: NextResponse.json({ error: "No session uses that code." }, { status: 404 }) };
  return { auth, doc };
}

export async function GET(_request, { params }) {
  const { response, doc } = await load(params);
  if (response) return response;
  return NextResponse.json({ session: toPublicSession(doc) });
}

// Only the host can delete a session.
export async function DELETE(_request, { params }) {
  const { response, auth, doc } = await load(params);
  if (response) return response;
  if (doc.hostEmail !== auth.user.email) {
    return NextResponse.json({ error: "Only the host can delete this session." }, { status: 403 });
  }
  await StudySession.deleteOne({ _id: doc._id });
  return new NextResponse(null, { status: 204 });
}

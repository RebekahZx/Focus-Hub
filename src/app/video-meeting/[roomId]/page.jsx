"use client"
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, PhoneOff } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

// Calls run on Jitsi Meet, embedded in an iframe. Set NEXT_PUBLIC_JITSI_DOMAIN to use
// your own Jitsi server or a JaaS tenant instead of the public meet.jit.si.
const JITSI_DOMAIN = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si";

// Room ids come from uuidv4(); only allow characters that are safe in a URL path.
const isValidRoomId = (id) => /^[A-Za-z0-9-]{1,64}$/.test(id);

export default function VideoMeeting() {
  const { roomId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  if (status === "loading") return <Loader />;

  if (!isValidRoomId(roomId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white dark:bg-gray-900">
        <p className="text-xl text-gray-800 dark:text-gray-100">That meeting code isn&apos;t valid.</p>
        <Button onClick={() => router.push("/")}>Back home</Button>
      </div>
    );
  }

  const displayName = encodeURIComponent(JSON.stringify(session?.user?.name || "Guest"));
  const src =
    `https://${JITSI_DOMAIN}/FocusHub-${roomId}` +
    `#userInfo.displayName=${displayName}&config.prejoinPageEnabled=false`;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info("Meeting link copied to clipboard");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 text-gray-100">
        <span className="font-semibold">Focus Hub</span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" /> Copy link
          </Button>
          <Button variant="destructive" size="sm" onClick={() => router.push("/")}>
            <PhoneOff className="w-4 h-4 mr-2" /> Leave
          </Button>
        </div>
      </div>
      {!loaded && <Loader />}
      <iframe
        title="Meeting"
        src={src}
        className="flex-grow w-full border-0"
        allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

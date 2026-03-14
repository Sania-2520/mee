"use client";

import { useEffect, useRef } from "react";

export default function MeetingRoom({ roomId }: { roomId: string }) {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const loadJitsi = () => {

      const domain = "meet.jit.si";

      const options = {
        roomName: roomId,
        width: "100%",
        height: 500,
        parentNode: containerRef.current,
        userInfo: {
          displayName: "User"
        }
      };

      new (window as any).JitsiMeetExternalAPI(domain, options);
    };

    if (!(window as any).JitsiMeetExternalAPI) {

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = loadJitsi;
      document.body.appendChild(script);

    } else {
      loadJitsi();
    }

  }, [roomId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "10px",
        overflow: "hidden"
      }}
    />
  );
}
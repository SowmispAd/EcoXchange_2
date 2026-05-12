"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function QRScanner({ onScan }: { onScan?: (text: string) => void }) {
  const region = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const scanner = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      void scanner.current?.stop().catch(() => undefined);
    };
  }, []);

  const start = async () => {
    if (!region.current) return;
    const id = "qr-reader-region";
    region.current.id = id;
    const s = new Html5Qrcode(id);
    scanner.current = s;
    try {
      await s.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          onScan?.(decoded);
          toast.success(`Scanned: ${decoded.slice(0, 32)}${decoded.length > 32 ? "…" : ""}`);
        },
        () => undefined,
      );
      setRunning(true);
    } catch {
      toast.error("Camera access failed. Allow permission or use HTTPS.");
    }
  };

  const stop = async () => {
    if (scanner.current && running) {
      await scanner.current.stop().catch(() => undefined);
      try {
        scanner.current.clear();
      } catch {
        /* ignore */
      }
    }
    scanner.current = null;
    setRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR scanner</CardTitle>
        <CardDescription>Scan pickup QR codes or bag stickers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={region} className="rounded-lg overflow-hidden bg-muted min-h-[200px]" />
        <div className="flex gap-2">
          {!running ? (
            <Button type="button" onClick={() => void start()}>
              Start camera
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={() => void stop()}>
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const REGION_ID = "ecoxchange-qr-reader";

export function QRScanner({ onScan }: { onScan?: (text: string) => void }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef(false);
  const [running, setRunning] = useState(false);

  const safeStop = useCallback(async () => {
    const s = scannerRef.current;
    if (!s || !runningRef.current) {
      scannerRef.current = null;
      runningRef.current = false;
      setRunning(false);
      return;
    }
    try {
      await s.stop();
    } catch {
      /* html5-qrcode throws if not running */
    }
    try {
      await s.clear();
    } catch {
      /* ignore */
    }
    scannerRef.current = null;
    runningRef.current = false;
    setRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      void safeStop();
    };
  }, [safeStop]);

  const start = async () => {
    await safeStop();
    if (!regionRef.current) return;
    regionRef.current.id = REGION_ID;
    const s = new Html5Qrcode(REGION_ID);
    scannerRef.current = s;
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
      runningRef.current = true;
      setRunning(true);
    } catch {
      scannerRef.current = null;
      runningRef.current = false;
      setRunning(false);
      toast.error("Camera access failed. Allow permission or use HTTPS.");
    }
  };

  const stop = () => {
    void safeStop();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR scanner</CardTitle>
        <CardDescription>Scan pickup QR codes or bag stickers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={regionRef} className="rounded-lg overflow-hidden bg-muted min-h-[200px]" />
        <div className="flex gap-2">
          {!running ? (
            <Button type="button" onClick={start}>
              Start camera
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={stop}>
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RotateCw, X, Check, AlertCircle, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture?: (blob: Blob, dataUrl: string) => void;
  onClose?: () => void;
  className?: string;
  allowRetake?: boolean;
  showPreview?: boolean;
}

type CameraState = "idle" | "requesting" | "active" | "captured" | "error";

export function CameraCapture({
  onCapture,
  onClose,
  className,
  allowRetake = true,
  showPreview = true,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  /** Detect if multiple cameras are available */
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoCams = devices.filter((d) => d.kind === "videoinput");
      setHasMultipleCameras(videoCams.length > 1);
    });
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async (facing: "user" | "environment" = facingMode) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("Camera is not supported in this browser.");
      setState("error");
      return;
    }

    setState("requesting");
    stopStream();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState("active");
      setErrorMsg("");
    } catch (err: unknown) {
      stopStream();
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMsg("Camera access was denied. Please allow camera permissions in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setErrorMsg("No camera found on this device.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setErrorMsg("Camera is already in use by another application.");
        } else if (err.name === "OverconstrainedError") {
          // Retry without facingMode constraint
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              await videoRef.current.play();
            }
            setState("active");
            return;
          } catch {
            setErrorMsg("Could not access camera with the requested settings.");
          }
        } else {
          setErrorMsg(`Camera error: ${err.message}`);
        }
      } else {
        setErrorMsg("An unexpected error occurred while accessing the camera.");
      }
      setState("error");
    }
  }, [facingMode, stopStream]);

  /** Auto-start camera on mount */
  useEffect(() => {
    const t = setTimeout(() => {
      startCamera();
    }, 0);
    return () => {
      clearTimeout(t);
      stopStream();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror front camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedUrl(dataUrl);
    stopStream();
    setState("captured");

    // Convert to blob and fire callback
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture?.(blob, dataUrl);
      },
      "image/jpeg",
      0.92
    );
  }, [facingMode, onCapture, stopStream]);

  const retake = useCallback(() => {
    setCapturedUrl(null);
    setState("idle");
    startCamera(facingMode);
  }, [facingMode, startCamera]);

  const flipCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  return (
    <Card className={cn("overflow-hidden border-2 border-primary/20", className)}>
      <CardContent className="p-0">
        <div className="relative bg-black aspect-video flex items-center justify-center min-h-[240px]">
          {/* Live video feed */}
          <video
            ref={videoRef}
            className={cn(
              "w-full h-full object-cover",
              facingMode === "user" && "-scale-x-100",
              (state !== "active") && "hidden"
            )}
            playsInline
            muted
            autoPlay
          />

          {/* Captured image preview */}
          {state === "captured" && capturedUrl && showPreview && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={capturedUrl}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Loading state */}
          {state === "requesting" && (
            <div className="flex flex-col items-center gap-3 text-white p-6">
              <div className="h-12 w-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <p className="text-sm opacity-80">Requesting camera access…</p>
            </div>
          )}

          {/* Idle state */}
          {state === "idle" && (
            <div className="flex flex-col items-center gap-3 text-white p-6">
              <VideoOff className="h-12 w-12 opacity-40" />
              <p className="text-sm opacity-60">Camera not started</p>
              <Button size="sm" onClick={() => startCamera()}>
                <Camera className="mr-2 h-4 w-4" /> Start Camera
              </Button>
            </div>
          )}

          {/* Error state */}
          {state === "error" && (
            <div className="flex flex-col items-center gap-3 text-white p-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-sm text-red-300">{errorMsg}</p>
              <Button size="sm" variant="outline" onClick={() => startCamera()} className="text-white border-white/30">
                Try Again
              </Button>
            </div>
          )}

          {/* Overlay badges */}
          {state === "active" && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500/80 text-white border-none animate-pulse text-xs">
                ● LIVE
              </Badge>
            </div>
          )}
          {state === "captured" && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-emerald-500/80 text-white border-none text-xs">
                ✓ Captured
              </Badge>
            </div>
          )}

          {/* Close button */}
          {onClose && (
            <button
              onClick={() => { stopStream(); onClose(); }}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Flip camera button (active only, multiple cameras) */}
          {state === "active" && hasMultipleCameras && (
            <button
              onClick={flipCamera}
              className="absolute bottom-16 right-3 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              title="Flip camera"
            >
              <RotateCw className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 p-4 bg-muted/30">
          {state === "active" && (
            <Button onClick={capturePhoto} size="lg" className="rounded-full h-14 w-14 p-0">
              <Camera className="h-6 w-6" />
            </Button>
          )}

          {state === "captured" && allowRetake && (
            <>
              <Button variant="outline" onClick={retake} className="gap-2">
                <RotateCw className="h-4 w-4" /> Retake
              </Button>
              <Button onClick={() => {}} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Check className="h-4 w-4" /> Use Photo
              </Button>
            </>
          )}

          {state === "error" && (
            <p className="text-xs text-muted-foreground text-center px-2">{errorMsg}</p>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}

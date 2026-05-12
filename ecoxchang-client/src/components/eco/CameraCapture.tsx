"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

export function CameraCapture({ label = "Capture proof" }: { label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onFile = (f: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    toast.success("Image attached (demo)");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>Use your device camera or upload a photo.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 items-start">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <Button type="button" onClick={() => inputRef.current?.click()}>
          <Camera className="mr-2 h-4 w-4" />
          Take / choose photo
        </Button>
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload only
        </Button>
        {preview && (
          <img src={preview} alt="Preview" className="h-32 w-32 rounded-lg object-cover border" />
        )}
      </CardContent>
    </Card>
  );
}

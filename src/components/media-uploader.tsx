import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useUploadMediaMutation } from "@/store/api/appsApi";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaUploaderProps {
  onUploadComplete: (path: string, url: string) => void;
  initialValue?: string;
  bucket?: "public" | "private";
}

export function MediaUploader({
  onUploadComplete,
  initialValue,
  bucket = "public",
}: MediaUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Upload immediately
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("bucket", bucket);
    formData.append("category", "app-icons");

    try {
      const result = await uploadMedia(formData).unwrap();
      onUploadComplete(result.file_path, result.url);
      // Optional: Clean up object URL if we were doing more complex memory management,
      // but usually fine for simple previews.
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");

      setPreview(null);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadComplete("", "");
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            "border-muted-foreground/25 hover:border-primary/50 py-6"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm text-muted-foreground text-center mt-2">
                <span className="font-semibold text-primary">
                  Click to upload
                </span>{" "}
                or drag and drop
                <br />
                <span className="text-xs">JPG, PNG (max. 10MB)</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative w-full h-[150px] rounded-lg overflow-hidden border bg-muted/50 group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

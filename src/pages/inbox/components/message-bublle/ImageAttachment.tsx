import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Eye, ImageIcon } from "lucide-react";
import { useState } from "react";

function ImageAttachment({
  attachmentUrl,
  totalImage,
}: {
  attachmentUrl: string;
  totalImage: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <ImageIcon className="h-5 w-5" />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      <div className="block relative group">
        {!loaded && (
          <div className="w-40 h-40 rounded-lg bg-muted animate-pulse flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
        {attachmentUrl && (
          <img
            src={attachmentUrl}
            alt="image"
            className={cn(
              "min-w-40 min-h-40 max-w-[280px] max-h-[300px] rounded-lg object-cover cursor-pointer",
              !loaded && "hidden",
              totalImage > 1 && "max-w-[130px] max-h-[150px]",
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}

        {/* Hover button overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg bg-black/40 transition-all opacity-0 group-hover:opacity-100",
            "flex items-center justify-center",
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              setPreviewOpen(true);
            }}
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-background/95 border-0">
          <div className="flex items-center justify-center w-full h-full min-h-[500px] p-8">
            <img
              src={attachmentUrl}
              alt="preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageAttachment;

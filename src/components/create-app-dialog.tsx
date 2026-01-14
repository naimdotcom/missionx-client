"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { MediaUploader } from "./media-uploader";
import { useCreateAppMutation } from "@/store/api/appsApi";
import { cn } from "@/lib/utils";

export function CreateAppDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [createApp, { isLoading }] = useCreateAppMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconPath, setIconPath] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        config: iconPath ? { image: iconPath } : {},
      };

      await createApp(payload).unwrap();
      onOpenChange?.(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create app:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setIconPath("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Create New App</DialogTitle>
          <DialogDescription>
            Launch a new automation flow in seconds.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {/* Vertical Stacked Inputs */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              App Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. TechHub Support"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Description
            </Label>
            <Input
              id="description"
              placeholder="What does this app do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Compact Upload Area */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              App Icon
            </Label>
            <MediaUploader onUploadComplete={setIconPath} bucket="public" />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Building..." : "Launch App"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

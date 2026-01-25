// // Hook for managing file uploads with progress tracking

// import { useCallback, useState } from "react";
// import { apiClient } from "~/services/api-client";
// import { Attachment } from "~/types/message";

// export interface UploadState {
//   file: File;
//   attachment: Attachment;
// }

// export const useUpload = () => {
//   const [uploads, setUploads] = useState<Map<string, UploadState>>(new Map());

//   const startUpload = useCallback(async (file: File): Promise<Attachment> => {
//     // Create local preview
//     const previewUrl = URL.createObjectURL(file);
//     const tempId = `temp-${Date.now()}-${Math.random()}`;

//     const attachment: Attachment = {
//       id: tempId,
//       type: inferContentType(file.type),
//       url: "",
//       previewUrl,
//       fileName: file.name,
//       fileSize: file.size,
//       mimeType: file.type,
//       status: "uploading",
//       uploadProgress: 0,
//     };

//     setUploads((prev) => new Map(prev).set(tempId, { file, attachment }));

//     try {
//       // Upload file to server
//       const response = await apiClient.upload<{ url: string; id: string }>(
//         "/uploads",
//         file,
//         (progress) => {
//           setUploads((prev) => {
//             const updated = new Map(prev);
//             const state = updated.get(tempId);
//             if (state) {
//               updated.set(tempId, {
//                 ...state,
//                 attachment: {
//                   ...state.attachment,
//                   uploadProgress: progress,
//                 },
//               });
//             }
//             return updated;
//           });
//         },
//       );

//       // Update attachment with server URL
//       const uploadedAttachment: Attachment = {
//         ...attachment,
//         id: response.data.id,
//         url: response.data.url,
//         status: "uploaded",
//         uploadProgress: 100,
//       };

//       setUploads((prev) => {
//         const updated = new Map(prev);
//         updated.set(tempId, { file, attachment: uploadedAttachment });
//         return updated;
//       });

//       // Clean up preview URL
//       URL.revokeObjectURL(previewUrl);

//       return uploadedAttachment;
//     } catch (error) {
//       console.error("Upload failed:", error);

//       const failedAttachment: Attachment = {
//         ...attachment,
//         status: "failed",
//       };

//       setUploads((prev) => {
//         const updated = new Map(prev);
//         updated.set(tempId, { file, attachment: failedAttachment });
//         return updated;
//       });

//       throw error;
//     }
//   }, []);

//   const removeUpload = useCallback((attachmentId: string) => {
//     setUploads((prev) => {
//       const updated = new Map(prev);
//       const state = updated.get(attachmentId);

//       // Clean up preview URL if exists
//       if (state?.attachment.previewUrl) {
//         URL.revokeObjectURL(state.attachment.previewUrl);
//       }

//       updated.delete(attachmentId);
//       return updated;
//     });
//   }, []);

//   const retryUpload = useCallback(
//     async (attachmentId: string): Promise<Attachment | null> => {
//       const state = uploads.get(attachmentId);
//       if (!state) return null;

//       // Remove failed upload
//       removeUpload(attachmentId);

//       // Restart upload
//       return startUpload(state.file);
//     },
//     [uploads, removeUpload, startUpload],
//   );

//   const clearUploads = useCallback(() => {
//     // Clean up all preview URLs
//     uploads.forEach((state) => {
//       if (state.attachment.previewUrl) {
//         URL.revokeObjectURL(state.attachment.previewUrl);
//       }
//     });
//     setUploads(new Map());
//   }, [uploads]);

//   return {
//     uploads: Array.from(uploads.values()).map((state) => state.attachment),
//     startUpload,
//     removeUpload,
//     retryUpload,
//     clearUploads,
//   };
// };

// // Helper to infer content type from MIME type
// function inferContentType(mimeType: string): Attachment["type"] {
//   if (mimeType.startsWith("image/")) return "image";
//   if (mimeType.startsWith("video/")) return "video";
//   if (mimeType.startsWith("audio/")) return "audio";
//   return "file";
// }

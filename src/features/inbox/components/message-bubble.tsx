// // Individual message bubble component

// import { format } from "date-fns";
// import { Loader2 } from "lucide-react";
// import { cn } from "~/lib/utils";
// import { UnifiedMessage } from "~/types/message";

// interface MessageBubbleProps {
//   message: UnifiedMessage;
//   showAvatar: boolean;
// }

// export const MessageBubble = ({ message, showAvatar }: MessageBubbleProps) => {
//   const isOutbound = message.direction === "outbound";
//   const timestamp = format(new Date(message.timestamp), "h:mm a");

//   return (
//     <div
//       className={cn("flex gap-3", isOutbound ? "justify-end" : "justify-start")}
//     >
//       {/* Avatar (for inbound messages) */}
//       {!isOutbound && (
//         <div className="flex-shrink-0">
//           {showAvatar ? (
//             message.sender.avatarUrl ? (
//               <img
//                 src={message.sender.avatarUrl}
//                 alt={message.sender.name}
//                 className="w-8 h-8 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
//                 {message.sender.name.charAt(0).toUpperCase()}
//               </div>
//             )
//           ) : (
//             <div className="w-8 h-8" />
//           )}
//         </div>
//       )}

//       {/* Message Content */}
//       <div className={cn("max-w-[70%] space-y-1", isOutbound && "items-end")}>
//         {/* Sender name (for inbound, if showing avatar) */}
//         {!isOutbound && showAvatar && (
//           <p className="text-xs font-medium text-muted-foreground px-3">
//             {message.sender.name}
//           </p>
//         )}

//         {/* Bubble */}
//         <div
//           className={cn(
//             "rounded-lg px-4 py-2",
//             isOutbound
//               ? "bg-primary text-primary-foreground"
//               : "bg-muted text-foreground",
//           )}
//         >
//           {/* Text content */}
//           {message.text && (
//             <p className="text-sm whitespace-pre-wrap break-words">
//               {message.text}
//             </p>
//           )}

//           {/* Attachments */}
//           {message.attachments.length > 0 && (
//             <div className="mt-2 space-y-2">
//               {message.attachments.map((attachment) => (
//                 <div key={attachment.id}>
//                   {attachment.type === "image" && (
//                     <img
//                       src={attachment.url || attachment.previewUrl}
//                       alt={attachment.fileName || "Image"}
//                       className="rounded-md max-w-full"
//                     />
//                   )}
//                   {attachment.type === "video" && (
//                     <video
//                       src={attachment.url || attachment.previewUrl}
//                       controls
//                       className="rounded-md max-w-full"
//                     />
//                   )}
//                   {attachment.type === "file" && (
//                     <a
//                       href={attachment.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm underline"
//                     >
//                       {attachment.fileName || "Download file"}
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Optimistic indicator */}
//           {message.isOptimistic && (
//             <div className="flex items-center gap-1 mt-1">
//               <Loader2 className="w-3 h-3 animate-spin" />
//               <span className="text-xs opacity-70">Sending...</span>
//             </div>
//           )}
//         </div>

//         {/* Timestamp */}
//         <p
//           className={cn(
//             "text-xs text-muted-foreground px-3",
//             isOutbound && "text-right",
//           )}
//         >
//           {timestamp}
//         </p>
//       </div>
//     </div>
//   );
// };

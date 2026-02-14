// // Rich text input with multi-line support

// import { useEffect, useRef } from "react";
// import { cn } from "~/lib/utils";
// import { ChannelNormalizer } from "~/services/channel-normalizer";
// import { ChannelType } from "~/types/message";

// interface RichTextInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
//   placeholder?: string;
//   channelType: ChannelType;
// }

// export const RichTextInput = ({
//   value,
//   onChange,
//   onKeyDown,
//   placeholder,
//   channelType,
// }: RichTextInputProps) => {
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const constraints = ChannelNormalizer.getChannelConstraints(channelType);

//   // Auto-resize textarea
//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
//     }
//   }, [value]);

//   const isNearLimit = value.length > constraints.characterCountWarning;
//   const isOverLimit = value.length > constraints.maxTextLength;

//   return (
//     <div className="flex-1 relative">
//       <textarea
//         ref={textareaRef}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         onKeyDown={onKeyDown}
//         placeholder={placeholder}
//         className={cn(
//           "w-full resize-none rounded-md border bg-background px-3 py-2",
//           "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
//           "text-sm",
//           isOverLimit && "border-destructive",
//         )}
//         rows={1}
//         maxLength={constraints.maxTextLength}
//       />

//       {/* Character counter */}
//       {isNearLimit && (
//         <div
//           className={cn(
//             "absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-md",
//             isOverLimit
//               ? "bg-destructive text-destructive-foreground"
//               : "bg-muted text-muted-foreground",
//           )}
//         >
//           {value.length} / {constraints.maxTextLength}
//         </div>
//       )}
//     </div>
//   );
// };

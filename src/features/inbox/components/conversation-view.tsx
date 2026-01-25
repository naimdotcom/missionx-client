// // Conversation view with message thread

// import { Loader2 } from "lucide-react";
// import { useEffect, useRef } from "react";
// import { MessageBubble } from "./message-bubble";

// interface ConversationViewProps {
//   ticketId: string;
// }

// export const ConversationView = ({ ticketId }: ConversationViewProps) => {
//   const { data: messages, isLoading, error } = useMessages(ticketId);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Subscribe to real-time messages
//   useRealtimeMessages(ticketId);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-full p-4">
//         <p className="text-sm text-destructive">
//           Failed to load messages. Please try again.
//         </p>
//       </div>
//     );
//   }

//   if (!messages || messages.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full p-4">
//         <p className="text-sm text-muted-foreground">No messages yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full overflow-y-auto p-4 space-y-4">
//       {messages.map((message, index) => {
//         const showAvatar =
//           index === messages.length - 1 ||
//           messages[index + 1]?.sender.id !== message.sender.id;

//         return (
//           <MessageBubble
//             key={message.id}
//             message={message}
//             showAvatar={showAvatar}
//           />
//         );
//       })}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// };

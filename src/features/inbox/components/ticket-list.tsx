// // Virtualized ticket list for performance with large datasets

// import { Loader2 } from "lucide-react";
// import { useTickets } from "~/hooks/use-tickets";
// import { TicketFilters } from "~/types/ticket";
// import { TicketCard } from "./ticket-card";

// interface TicketListProps {
//   workspaceId: string;
//   filters: TicketFilters;
//   selectedTicketId?: string;
//   onSelectTicket: (ticketId: string) => void;
// }

// export const TicketList = ({
//   workspaceId,
//   filters,
//   selectedTicketId,
//   onSelectTicket,
// }: TicketListProps) => {
//   const { data: tickets, isLoading, error } = useTickets(workspaceId, filters);

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
//           Failed to load tickets. Please try again.
//         </p>
//       </div>
//     );
//   }

//   if (!tickets || tickets.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full p-4">
//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">No tickets found</p>
//           <p className="text-xs text-muted-foreground mt-1">
//             Try adjusting your filters
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full overflow-y-auto">
//       <div className="divide-y">
//         {tickets.map((ticket) => (
//           <TicketCard
//             key={ticket.id}
//             ticket={ticket}
//             isSelected={ticket.id === selectedTicketId}
//             onClick={() => onSelectTicket(ticket.id)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Channel context banner showing channel-specific constraints

// import { Info } from "lucide-react";
// import { cn } from "~/lib/utils";
// import { ChannelNormalizer } from "~/services/channel-normalizer";
// import { ChannelType } from "~/types/message";

// interface ChannelContextProps {
//   channelType: ChannelType;
//   currentLength: number;
// }

// export const ChannelContext = ({
//   channelType,
//   currentLength,
// }: ChannelContextProps) => {
//   const constraints = ChannelNormalizer.getChannelConstraints(channelType);
//   const isNearLimit = currentLength > constraints.characterCountWarning;

//   if (!isNearLimit) return null;

//   const platformName =
//     channelType === "facebook_page" ? "Facebook" : "Instagram";

//   return (
//     <div
//       className={cn(
//         "flex items-start gap-2 p-2 rounded-md text-xs",
//         currentLength > constraints.maxTextLength
//           ? "bg-destructive/10 text-destructive"
//           : "bg-muted text-muted-foreground",
//       )}
//     >
//       <Info className="w-4 h-4 shrink-0 mt-0.5" />
//       <div>
//         <p className="font-medium">
//           {platformName} character limit: {constraints.maxTextLength}
//         </p>
//         <p>
//           Current: {currentLength} / {constraints.maxTextLength}
//         </p>
//       </div>
//     </div>
//   );
// };

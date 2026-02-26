import { ChannelPlatform } from "@/api";
import { cn } from "@/lib/utils";
import { ChannelIcon } from "./ChannelIcons";

type ChannelHeadProps = {
  label: string;
  className?: string;
  description: string;
  platform: ChannelPlatform;
};
function ChannelHead(props: ChannelHeadProps) {
  return (
    <div className={cn("flex items-center flex-1 gap-2.5", props.className)}>
      <ChannelIcon platform={props.platform} />
      <div>
        <h2 className="text-sm font-semibold">{props.label}</h2>
        <p className="text-xs text-muted-foreground">{props.description}</p>
      </div>
    </div>
  );
}

export default ChannelHead;

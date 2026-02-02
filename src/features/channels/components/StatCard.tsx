import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description: string;
  iconColor: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  description,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group transition-all duration-300 hover:shadow-md border-muted-foreground/10">
      <div
        className={cn(
          "absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-500",
          iconColor,
        )}
      >
        <Icon className="w-24 h-24" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10",
            iconColor,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-black tracking-tight tabular-nums">
            {value}
          </div>
          <p className="text-[10px] font-medium text-muted-foreground mt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

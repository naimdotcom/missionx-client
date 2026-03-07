import { useTheme } from "@/components/theme-provider";
import { Palette } from "lucide-react";
import { toast } from "sonner";

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();

  const handleSetTheme = (value: "light" | "dark" | "system") => {
    setTheme(value);
    toast.success("Theme updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Quickly switch app theme.
          </p>
        </div>
        <Palette />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleSetTheme("light")}
          className={`rounded-lg border p-4 text-left hover:shadow-sm ${theme === "light" ? "ring-2 ring-primary" : ""}`}
        >
          <LightThemePreview />
        </button>

        <button
          type="button"
          onClick={() => handleSetTheme("dark")}
          className={`rounded-lg border p-4 text-left hover:shadow-sm ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
        >
          <DarkThemePreview />
        </button>

        <button
          type="button"
          onClick={() => handleSetTheme("system")}
          className={`rounded-lg border p-4 text-left hover:shadow-sm ${theme === "system" ? "ring-2 ring-primary" : ""}`}
        >
          <div className="font-medium">System</div>
          <div className="text-sm text-muted-foreground">
            Follow your OS preference.
          </div>
        </button>
      </div>
    </div>
  );
}

function LightThemePreview() {
  return (
    <div>
      <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
          <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
          </div>
          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
          </div>
          <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
          </div>
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal">Light</span>
    </div>
  );
}
function DarkThemePreview() {
  return (
    <div>
      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
        <div className="space-y-2 rounded-sm bg-slate-950 p-2">
          <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
          </div>
          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
            <div className="h-4 w-4 rounded-full bg-slate-400" />
            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
          </div>
          <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
            <div className="h-4 w-4 rounded-full bg-slate-400" />
            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
          </div>
        </div>
      </div>
      <span className="block w-full p-2 text-center font-normal">Dark</span>
    </div>
  );
}

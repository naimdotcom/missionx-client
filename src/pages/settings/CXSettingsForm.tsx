import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

export function CXSettingsForm() {
  const form = useForm({
    defaultValues: {
      enable_auto_reply: true,
      cx_provider: "openai",
      sentiment_analysis: true,
      response_timeout: "30",
      auto_escalation: false,
      escalation_email: "",
    },
    onSubmit: async (values) => {
      const v = values.value;

      if (v.auto_escalation) {
        const email = v.escalation_email || "";
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!email || !emailRegex.test(email)) {
          toast.error(
            "Provide a valid escalation email when auto-escalation is enabled.",
          );
          return;
        }
      }

      // TODO: send to backend
      console.log("CX Settings Updated:", v);
      toast.success("CX Settings updated successfully!");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <form.Field
          name="enable_auto_reply"
          children={(field) => (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">Auto Reply</div>
                <div className="text-sm text-muted-foreground">
                  Automatically respond to customer inquiries based on
                  established rules.
                </div>
              </div>
              <Switch
                checked={!!field.state.value}
                onCheckedChange={(v) => field.handleChange(v)}
              />
            </div>
          )}
        />

        <form.Field
          name="sentiment_analysis"
          children={(field) => (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">Sentiment Analysis</div>
                <div className="text-sm text-muted-foreground">
                  Analyze the emotional tone of customer messages in real-time.
                </div>
              </div>
              <Switch
                checked={!!field.state.value}
                onCheckedChange={(v) => field.handleChange(v)}
              />
            </div>
          )}
        />

        <form.Field
          name="auto_escalation"
          children={(field) => (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">Auto Escalation</div>
                <div className="text-sm text-muted-foreground">
                  Escalate complex issues to human agents automatically when AI
                  cannot resolve them.
                </div>
              </div>
              <Switch
                checked={!!field.state.value}
                onCheckedChange={(v) => field.handleChange(v)}
              />
            </div>
          )}
        />

        <form.Field
          name="escalation_email"
          validators={{
            onChange: ({ value }) =>
              value && !/^\S+@\S+\.\S+$/.test(value)
                ? "Invalid email address"
                : undefined,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Escalation Email Address</Label>
              <Input
                id={field.name}
                value={field.state.value as string | undefined}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="support@company.com"
              />
              <p className="text-sm text-muted-foreground">
                The email address where escalated tickets will be sent.
              </p>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="cx_provider"
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>AI Engine Provider</Label>
              <Select
                onValueChange={(v) => field.handleChange(v)}
                defaultValue={field.state.value as string}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                  <SelectItem value="anthropic">
                    Anthropic (Claude 3.5)
                  </SelectItem>
                  <SelectItem value="gemini">Google Gemini 1.5 Pro</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choice of AI engine for processing customer interactions.
              </p>
            </div>
          )}
        />

        <form.Field
          name="response_timeout"
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Response Timeout (seconds)</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value as string | undefined}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Maximum time allowed for AI to generate a response.
              </p>
            </div>
          )}
        />
      </div>

      <Button type="submit">Save CX Configurations</Button>
    </form>
  );
}

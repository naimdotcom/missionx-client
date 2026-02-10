import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { DynamicField } from "./FormField";

/**
 * Field configuration for FormBuilder
 */
export interface FieldConfig {
  name: string;
  label?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "checkbox"
    | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
  className?: string;
  containerClassName?: string;
  defaultValue?: any;
}

/**
 * FormBuilder Props
 */
interface FormBuilderProps<TData extends Record<string, any>> {
  fields: FieldConfig[];
  schema: z.ZodSchema<TData>;
  onSubmit: (values: TData) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  formClassName?: string;
  submitClassName?: string;
  defaultValues?: Partial<TData>;
  children?: (form: any) => React.ReactNode;
  submitVariant?:
    | "secondary"
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "ghost"
    | null
    | undefined;
}

/**
 * FormBuilder - Auto-generates form from config
 *
 * Example usage:
 * ```tsx
 * <FormBuilder
 *   fields={[
 *     { name: "email", label: "Email", type: "email", placeholder: "m@example.com" },
 *     { name: "password", label: "Password", type: "password" },
 *   ]}
 *   schema={z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8),
 *   })}
 *   onSubmit={async (values) => console.log(values)}
 * />
 * ```
 */
export function FormBuilder<TData extends Record<string, any>>({
  fields,
  schema,
  onSubmit,
  submitClassName,
  submitLabel = "Submit",
  className,
  formClassName,
  defaultValues = {},
  children,
  submitVariant,
}: FormBuilderProps<TData>) {
  // Build default values from field config
  const fieldDefaults = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]:
        field.defaultValue ?? (field.type === "checkbox" ? false : ""),
    }),
    {} as any,
  );

  const form = useForm({
    defaultValues: { ...fieldDefaults, ...defaultValues } as TData,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className={cn("space-y-4", formClassName)}
      >
        {fields.map((fieldConfig) => (
          <form.Field
            key={fieldConfig.name}
            name={fieldConfig.name as any}
            validators={{
              onChange: ({ value }) => {
                const result = schema.safeParse({
                  ...form.state.values,
                  [fieldConfig.name]: value,
                });
                if (!result.success) {
                  const fieldError = result.error.issues.find(
                    (e: any) => e.path[0] === fieldConfig.name,
                  );
                  return fieldError?.message;
                }
                return undefined;
              },
            }}
            children={(field) => (
              <DynamicField field={field} config={fieldConfig} />
            )}
          />
        ))}

        {children && children(form)}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              variant={submitVariant}
              className={cn(submitClassName)}
            >
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          )}
        />
      </form>
    </div>
  );
}

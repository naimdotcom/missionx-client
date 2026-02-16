import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";

/**
 * Display field errors when touched
 */
function FieldInfo({ field }: { field: any }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-xs font-medium text-destructive mt-1">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </>
  );
}

/**
 * Text Input Field Wrapper
 * Handles text, email, password, number, etc.
 */
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  field: any;
  description?: string;
  containerClassName?: string;
}

export function TextField({
  field,
  label,
  className,
  description,
  containerClassName,
  ...props
}: TextFieldProps) {
  return (
    <div className={cn("grid gap-2", containerClassName)}>
      {label && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Input
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(
          field.state.meta.errors.length && field.state.meta.isTouched
            ? "border-destructive"
            : "",
          className,
        )}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <FieldInfo field={field} />
    </div>
  );
}

/**
 * Textarea Field Wrapper
 */
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  field: any;
  description?: string;
  containerClassName?: string;
}

export function TextareaField({
  field,
  label,
  description,
  className,
  containerClassName,
  ...props
}: TextareaFieldProps) {
  return (
    <div className={cn("grid gap-2", containerClassName)}>
      {label && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Textarea
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(
          field.state.meta.errors.length && field.state.meta.isTouched
            ? "border-destructive"
            : "",
          className,
        )}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <FieldInfo field={field} />
    </div>
  );
}

/**
 * Checkbox Field Wrapper
 */
interface CheckboxFieldProps {
  label: string;
  field: any;
  className?: string;
  description?: string;
}

export function CheckboxField({
  field,
  label,
  className,
  description,
}: CheckboxFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.name}
          checked={field.state.value ?? false}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label
          htmlFor={field.name}
          className="text-sm font-normal cursor-pointer"
        >
          {label}
        </Label>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground ml-6">{description}</p>
      )}
      <FieldInfo field={field} />
    </div>
  );
}

/**
 * Select Field Wrapper
 */
interface SelectFieldProps {
  label?: string;
  field: any;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

export function SelectField({
  field,
  label,
  options,
  placeholder = "Select an option",
  className,
  containerClassName,
}: SelectFieldProps) {
  return (
    <div className={cn("grid gap-2", containerClassName)}>
      {label && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Select
        value={field.state.value ?? ""}
        onValueChange={field.handleChange}
      >
        <SelectTrigger
          className={cn(
            field.state.meta.errors.length && field.state.meta.isTouched
              ? "border-destructive"
              : "",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldInfo field={field} />
    </div>
  );
}

/**
 * Generic Field Wrapper - Auto-detect field type
 * For maximum convenience when you want to pass config
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
}

interface DynamicFieldProps {
  field: any;
  config: FieldConfig;
}

export function DynamicField({ field, config }: DynamicFieldProps) {
  const { type = "text", ...rest } = config;

  switch (type) {
    case "textarea":
      return <TextareaField field={field} {...rest} />;
    case "checkbox":
      return (
        <CheckboxField
          field={field}
          label={config.label ?? ""}
          description={config.description}
          className={config.className}
        />
      );
    case "select":
      return (
        <SelectField
          field={field}
          label={config.label}
          options={config.options ?? []}
          placeholder={config.placeholder}
          className={config.className}
          containerClassName={config.containerClassName}
        />
      );
    default:
      return (
        <TextField
          field={field}
          label={config.label}
          type={type}
          placeholder={config.placeholder}
          className={config.className}
          containerClassName={config.containerClassName}
        />
      );
  }
}

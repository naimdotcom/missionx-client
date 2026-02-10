/**
 * Dynamic Form System - Usage Examples
 *
 * This file demonstrates different ways to use the dynamic form components
 */

import {
  CheckboxField,
  FormBuilder,
  SelectField,
  TextField,
} from "@/components/form";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

// ============================================
// APPROACH 1: Individual Field Wrappers (Most Flexible)
// ============================================

const ExampleForm1 = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Simple text field with validation */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Email is required";
            if (!value.includes("@")) return "Invalid email";
            return undefined;
          },
        }}
        children={(field) => (
          <TextField
            field={field}
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
        )}
      />

      {/* Password field */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            value.length < 8 ? "Must be 8+ characters" : undefined,
        }}
        children={(field) => (
          <TextField field={field} label="Password" type="password" />
        )}
      />

      {/* Select field */}
      <form.Field
        name="role"
        validators={{
          onChange: ({ value }) => (!value ? "Role is required" : undefined),
        }}
        children={(field) => (
          <SelectField
            field={field}
            label="Role"
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
          />
        )}
      />

      {/* Checkbox */}
      <form.Field
        name="rememberMe"
        children={(field) => (
          <CheckboxField
            field={field}
            label="Remember me"
            description="Stay logged in for 30 days"
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

// ============================================
// APPROACH 2: FormBuilder (Most Concise)
// ============================================

const ExampleForm2 = () => {
  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be 8+ characters"),
    role: z.string().min(1, "Role is required"),
    rememberMe: z.boolean(),
  });

  return (
    <FormBuilder
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ],
        },
        {
          name: "rememberMe",
          label: "Remember me",
          type: "checkbox",
          description: "Stay logged in for 30 days",
          defaultValue: false,
        },
      ]}
      schema={schema}
      onSubmit={async (values) => {
        console.log(values);
      }}
      submitLabel="Submit"
    />
  );
};

// ============================================
// APPROACH 3: Hybrid (Custom Layout + Field Wrappers)
// ============================================

const ExampleForm3 = () => {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Custom grid layout */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="firstName"
          children={(field) => <TextField field={field} label="First Name" />}
        />

        <form.Field
          name="lastName"
          children={(field) => <TextField field={field} label="Last Name" />}
        />
      </div>

      {/* Full-width textarea */}
      <form.Field
        name="bio"
        children={(field) => <TextField field={field} label="Bio" />}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export { ExampleForm1, ExampleForm2, ExampleForm3 };

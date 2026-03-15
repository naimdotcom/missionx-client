import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { useCreateCustomer, useUpdateCustomer } from "@/api/services/crm/crm.hook";
import type { CustomerCreate, CustomerResponse, CustomerUpdate } from "@/api/services/crm/crm.types";

const formSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  username: z.string().optional(),
  platform: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: CustomerResponse | null;
}

export function CustomerSheet({
  open,
  onOpenChange,
  customer,
}: CustomerSheetProps) {
  const isEditing = !!customer;

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      username: "",
      platform: "manual",
      is_active: true,
    },
  });

  useEffect(() => {
    if (customer && open) {
      form.reset({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        username: customer.username || "",
        platform: customer.platform || "manual",
        is_active: customer.is_active ?? true,
      });
    } else if (!open) {
      form.reset();
    }
  }, [customer, open, form]);

  const onSubmit = (values: FormValues) => {
    const basePayload = {
      ...values,
      is_active: values.is_active ?? true,
      app_id: customer?.app_id,
      platform_id: customer?.platform_id,
      profile_pic_url: customer?.profile_pic_url,
      locale: customer?.locale,
      timezone: customer?.timezone,
      gender: customer?.gender,
      custom_metadata: customer?.custom_metadata,
      attributes: customer?.attributes,
      tags: customer?.tags,
      source: customer?.source,
      notes: customer?.notes,
      assigned_to: customer?.assigned_to,
      lifetime_value: customer?.lifetime_value,
      is_blocked: customer?.is_blocked,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: customer.id!, payload: basePayload as unknown as CustomerUpdate },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(basePayload as unknown as CustomerCreate, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Customer" : "Add Customer"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the details of the customer."
              : "Create a new customer profile manually."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform / Source</FormLabel>
                    <FormControl>
                      <Input placeholder="manual" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Whether the customer can interact.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

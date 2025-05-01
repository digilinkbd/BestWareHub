"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  accountName: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  accountNumber: z.string().min(8, {
    message: "Please enter a valid account number.",
  }),
  bankName: z.string().min(2, {
    message: "Please enter a valid bank name.",
  }),
  swiftCode: z.string().min(8, {
    message: "Please enter a valid SWIFT/BIC code.",
  }),
  routingNumber: z.string().min(9, {
    message: "Please enter a valid routing number.",
  }),
});

interface BankDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export function BankDetails({ onNext, onBack }: BankDetailsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      swiftCode: "",
      routingNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onNext();
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
        <p className="text-gray-600">Add your bank account information for payments</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account holder name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name exactly as it appears on your bank account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="swiftCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SWIFT/BIC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SWIFT/BIC code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter routing number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mt-6">
            <h3 className="font-semibold text-yellow-900">Important Notice</h3>
            <ul className="mt-2 space-y-1 text-sm text-yellow-800">
              <li>• Ensure all banking information is accurate</li>
              <li>• Double-check the account number and routing number</li>
              <li>• Payments will be processed to this account</li>
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Previous Step
            </Button>
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { OrderStatus } from "@prisma/client";
import { Check, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useOrderDetails } from "@/hooks/useOrders";

interface UpdateOrderStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  orderId: string;
  orderNumber: string;
}

type FormValues = {
  status: OrderStatus;
};

export function UpdateOrderStatusDialog({
  isOpen,
  onClose,
  currentStatus,
  orderId,
  orderNumber,
}: UpdateOrderStatusDialogProps) {
  const { updateOrderStatus, isUpdating } = useOrderDetails(orderId); 

  const form = useForm<FormValues>({
    defaultValues: {
      status: currentStatus,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updateOrderStatus.mutate({ orderId, status: data.status }); 
    //   onClose(); // Close dialog after success
    } catch (error) {
      toast.error("Failed to update order status. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order {orderNumber}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isUpdating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Update Status
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

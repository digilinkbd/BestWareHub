"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateStoreStatus } from '@/hooks/useStore'
import { Check, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { VendorStatus } from '@prisma/client'

interface StoreStatusDialogProps {
  storeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType: 'APPROVE' | 'REJECT'
  storeName:string
}

interface FormValues {
  reason: string
}

const StoreStatusDialog: React.FC<StoreStatusDialogProps> = ({ 
  storeId, 
  open, 
  onOpenChange,
  actionType,
  storeName
}) => {
    
  const { updateStatus, isUpdating } = useUpdateStoreStatus()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>()

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit = (data: FormValues) => {
    const status: VendorStatus = actionType === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  
    updateStatus(
      { id: storeId, status, reason: actionType === 'REJECT' ? data.reason : undefined },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };
  

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={actionType === 'APPROVE' ? 'text-green-600' : 'text-red-600'}>
            {actionType === 'APPROVE' ? 'Approve Store' : 'Reject Store'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'APPROVE' 
              ? 'The vendor will be notified that their store has been approved.'
              : 'Please provide a reason for rejecting this store. The vendor will be notified.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {actionType === 'REJECT' && (
            <div className="space-y-2">
              <Textarea
                placeholder={`Provide a reason for rejection of ${storeName}`}
                className="min-h-[100px]"
                {...register('reason', { 
                  required: actionType === 'REJECT' ? 'Please provide a reason for rejection' : false 
                })}
              />
              {errors.reason && (
                <p className="text-sm text-red-500">{errors.reason.message}</p>
              )}
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating}
              variant={actionType === 'APPROVE' ? 'default' : 'destructive'}
              className={actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : actionType === 'APPROVE' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Approve Store
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Reject Store
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StoreStatusDialog
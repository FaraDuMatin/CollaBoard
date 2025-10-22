"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog'
import { useRenameModal } from '@/store/use-rename-modal';
import { FormEvent, FormEventHandler, use } from 'react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useMutation } from 'convex/react';
import {api} from '@/convex/_generated/api';
import { toast } from 'sonner';

export const RenameModal = () => {
    const mutate  = useMutation(api.board.update);
    
    const{
        isOpen,
        onClose,
        initialValues,
    } = useRenameModal();
    
    const [title, setTitle] = useState(initialValues.title)

    useEffect(() => {
        setTitle(initialValues.title)
    }, [initialValues.title])

    const onSubmit : FormEventHandler<HTMLFormElement> = (
      e,
    ) => {
      e.preventDefault();
      mutate({ id: initialValues.id as any, title })
        .then(() => {
          toast.success("Board renamed successfully");
          onClose();
        })
        .catch(() => {
          toast.error("Failed to rename board");
        });
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
            <DialogTitle>Edit Board Title</DialogTitle>
            
        </DialogHeader>
        <DialogDescription>Enter a new name for this board.</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
           <Input 
            disabled={false}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Board title'

           /> 
           <DialogFooter>
            <DialogClose >
                <Button type = "button" variant="outline">
                    Cancel
                  </Button>
            </DialogClose>
            <Button disabled={false} type= "submit">
              Save
            </Button>
        </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>



  )
}  
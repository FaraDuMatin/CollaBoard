import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <VisuallyHidden>
          <DialogTitle>Invite Members</DialogTitle>
        </VisuallyHidden>
        <OrganizationProfile routing="hash" />
      </DialogContent>
    </Dialog>
  );
};

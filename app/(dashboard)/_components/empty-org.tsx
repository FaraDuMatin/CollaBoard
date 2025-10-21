import Image from "next/image";
import { CreateOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export const EmptyOrg = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center ">
      <Image
        src="/logo.png"
        alt="Empty Organization"
        width={200}
        height={200}
      />
      <h2 className="text-2xl font-semibold mt-6">Welcome To Collaboard!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create or join an organization to get started.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Create Organization</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Organization</DialogTitle>
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </div>
  );
};

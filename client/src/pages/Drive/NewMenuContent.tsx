import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { FolderPlus, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { queryClient, trpc, trpcClient } from "@/utils/trpc";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type NewItemMenuContentProps = {
  variant: "context" | "dropdown",
  fileInputRef?: React.RefObject<HTMLInputElement | null>
}

export function NewItemMenuContent(props: NewItemMenuContentProps) {
  const id = useParams<{ id: string }>().id!;
  const { variant, fileInputRef } = props;
  const [newDirectoryName, setNewDirectoryName] = useState("Untitled directory")
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)

  let ContentComponent, ItemComponent;
  if (variant === "context") {
    ContentComponent = ContextMenuContent;
    ItemComponent = ContextMenuItem;
  } else {
    ContentComponent = DropdownMenuContent;
    ItemComponent = DropdownMenuItem;
  }

  return (
    <>
      <ContentComponent align="start" className="w-48">
        <ItemComponent onSelect={() => setNewFolderDialogOpen(true)}>
          <FolderPlus className="w-4 h-4 mr-2" />
          New folder
        </ItemComponent>
        <ItemComponent onSelect={() => { fileInputRef?.current?.click() }}>
          <Upload className="w-4 h-4 mr-2" />
          File upload
        </ItemComponent>
      </ContentComponent>
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            toast.promise(
              async () => {
                await trpcClient.directory.createChild.mutate({ id, name: newDirectoryName });
                const key = trpc.directory.getChildren.queryKey();
                queryClient.invalidateQueries({ queryKey: key })
              },
              {
                loading: 'creating...',
                success: 'created successfully!',
                error: 'error occurred while creating',
              }
            )
          }}>
            <div>
              <Label htmlFor="folder-name" className="mb-2">Folder name</Label>
              <Input
                id="folder-name"
                value={newDirectoryName}
                onChange={(e) => setNewDirectoryName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit">Create</Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

import { useState } from "react"
import { toast } from "sonner"
import { Download, Edit, Trash2, Link } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useChildren } from "@/hooks/useChildren"


type FileMenuContentProps = {
  id: string,
  name: string,
  type: "directory" | "file",
  variant: "context" | "dropdown"
}

export function DriveItemMenuContent(props: FileMenuContentProps) {
  const { id, name, type, variant } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { deleteDirectory, deleteFile } = useChildren();

  let ContentComponent, ItemComponent;
  if (variant === "context") {
    ContentComponent = ContextMenuContent;
    ItemComponent = ContextMenuItem;
  } else {
    ContentComponent = DropdownMenuContent;
    ItemComponent = DropdownMenuItem;
  }

  async function deleteItem() {
    const deleteFn = type === "directory" ? deleteDirectory : deleteFile;
    toast.promise(async () => deleteFn({ id }), {
      loading: 'deleting...',
      success: 'deleted successfully!',
      error: 'error occurred while deleting',
    });
  }

  // @ts-ignore
  async function downloadFile(fileUrl: string, filename: string) {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  return (
    <>
      <ContentComponent>
        <ItemComponent onSelect={() => { }}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </ItemComponent>
        <ItemComponent onSelect={() => { }}>
          <Link className="w-4 h-4 mr-2" />
          Copy link
        </ItemComponent>
        <ItemComponent onSelect={() => setDialogOpen(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Rename
        </ItemComponent>
        <ItemComponent className="text-destructive" onSelect={deleteItem}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ItemComponent>
      </ContentComponent>

      <RenameDialog
        id={id}
        name={name}
        type={type}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  )
}

type RenameDialogProps = {
  id: string,
  name: string,
  type: "directory" | "file",
  dialogOpen: boolean,
  setDialogOpen: (open: boolean) => void,
}

function RenameDialog(props: RenameDialogProps) {
  const { id, name, type, dialogOpen, setDialogOpen } = props;
  const [newName, setNewName] = useState(name);
  const { renameDirectory, renameFile } = useChildren();

  const renameFn = type === "directory" ? renameDirectory : renameFile;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          toast.promise(async () => renameFn({ id, newName }), {
            loading: 'renaming...',
            success: 'renamed successfully!',
            error: 'error occurred while renaming',
          })
        }}>
          <div>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder=""
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">
                  Rename
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

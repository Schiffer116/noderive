import { Button } from "@/components/ui/button"
import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { Download, Edit, Trash2, Link } from "lucide-react"
import { useState } from "react"
import { useChildren } from "@/hooks/useChildren"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

type FileMenuContentProps = {
  id: number,
  name: string,
  url: string,
  variant: "context" | "dropdown"
}

export function FileMenuContent(props: FileMenuContentProps) {
  const { id, name, url, variant } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { renameFile } = useChildren();

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
      <ContentComponent>
        <ItemComponent onSelect={() => {
          const a = document.createElement("a");
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </ItemComponent>
        <ItemComponent onSelect={() => navigator.clipboard.writeText(url)}>
          <Link className="w-4 h-4 mr-2" />
          Copy link
        </ItemComponent>
        <ItemComponent onSelect={() => setDialogOpen(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Rename
        </ItemComponent>
        <ItemComponent className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ItemComponent>
      </ContentComponent>

      <RenameDialog
        id={id}
        name={name}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        renameFn={renameFile}
      />
    </>
  )
}

type DirectoryMenuContentProps = {
  id: string,
  name: string,
  variant: "context" | "dropdown"
}

export function DirectoryMenuContent(props: DirectoryMenuContentProps) {
  const { id, name, variant } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const { deleteDirectory, renameDirectory } = useChildren();

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
      <ContentComponent>
        <ItemComponent onSelect={() => navigator.clipboard.writeText(
          new URL(id, window.location.href).toString()
        )}>
          <Link className="w-4 h-4 mr-2" />
          Copy link
        </ItemComponent>
        <ItemComponent onSelect={() => setDialogOpen(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Rename
        </ItemComponent>
        <ItemComponent className="text-destructive" onSelect={() => deleteDirectory(id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ItemComponent>
      </ContentComponent>

      <RenameDialog
        id={id}
        name={name}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        renameFn={renameDirectory}
      />
    </>
  )
}

type RenameDialogProps = {
  id: string | number,
  name: string,
  dialogOpen: boolean,
  setDialogOpen: (open: boolean) => void,
  renameFn: any
}

function RenameDialog(props: RenameDialogProps) {
  const { id, name, dialogOpen, setDialogOpen, renameFn } = props;
  const [newFolderName, setNewFolderName] = useState(name);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          renameFn({ id, name: newFolderName })
        }}>
          <div>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
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

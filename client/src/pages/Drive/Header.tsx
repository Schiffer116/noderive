import { Plus, FolderPlus, Settings, HelpCircle, LogOut, Upload } from "lucide-react"
import { useParams } from "react-router-dom"
import { useState, useRef } from "react";
import { generateReactHelpers } from "@uploadthing/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid3X3, List, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { useDriveContext } from "@/context/DriveContext";
import { useChildren } from "@/hooks/useChildren"
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const queryClient = useQueryClient();
  const parent = useParams<{ id: string }>().id!;
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)

  const { useUploadThing } = generateReactHelpers({ url: "/api/uploadthing" });
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: _ => {
      queryClient.invalidateQueries({ queryKey: ["children"] })
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = () => {
    const files = fileInputRef.current?.files;
    if (files === null || files == undefined) return;

    toast.promise(startUpload([files[0]], { parent }), {
      loading: 'uploading...',
      success: 'uploaded successfully!',
      error: 'error occurred while uploading',
    });
  }

  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
  } = useDriveContext()
  const { createDirectory } = useChildren();

  return (
    <header className="border-b px-6 py-3 flex items-center gap-4">
      <Toaster />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <span className="font-semibold text-lg">Noderive</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onSelect={() => setNewFolderDialogOpen(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            New folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => { fileInputRef.current?.click() }}>
            <Upload className="w-4 h-4 mr-2" />
            File upload
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderPlus className="w-4 h-4 mr-2" />
            Folder upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            createDirectory({ name: newFolderName, parent })}
          }>
            <div>
              <Label htmlFor="folder-name" className="mb-2">Folder name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Untitled folder"
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

      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search in Drive"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

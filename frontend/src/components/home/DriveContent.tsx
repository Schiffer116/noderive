import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { Archive, Copy, Download, Edit, FileText, Folder, ImageIcon, MoreVertical, Music, Share, Trash2, Video } from "lucide-react"
import { useMemo } from "react"

export interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "video" | "audio" | "archive"
  size?: string
  modified: string
}
const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <Folder className="w-8 h-8 text-blue-500" />
    case "document":
      return <FileText className="w-8 h-8 text-red-500" />
    case "image":
      return <ImageIcon className="w-8 h-8 text-green-500" />
    case "video":
      return <Video className="w-8 h-8 text-purple-500" />
    case "audio":
      return <Music className="w-8 h-8 text-orange-500" />
    case "archive":
      return <Archive className="w-8 h-8 text-yellow-500" />
    default:
      return <FileText className="w-8 h-8 text-gray-500" />
  }
}

type DriveContentProps = {
  currentPath: string[]
  setCurrentPath: (path: string[]) => void
  searchQuery: string
  viewMode: "grid" | "list"
}

function getDirectoryChildren(_path: string[]): FileItem[] {
  const sampleFiles: FileItem[] = [
    { id: "1", name: "Documents", type: "folder", modified: "2 days ago" },
    { id: "2", name: "Photos", type: "folder", modified: "1 week ago" },
    { id: "3", name: "Project Proposal.pdf", type: "document", size: "2.4 MB", modified: "3 hours ago" },
    { id: "4", name: "Vacation Photos", type: "folder", modified: "2 weeks ago" },
    { id: "5", name: "Meeting Notes.docx", type: "document", size: "156 KB", modified: "1 day ago" },
    { id: "6", name: "Screenshot 2024.png", type: "image", size: "1.2 MB", modified: "5 hours ago" },
    { id: "7", name: "Presentation.pptx", type: "document", size: "8.7 MB", modified: "2 days ago" },
    { id: "8", name: "Demo Video.mp4", type: "video", size: "45.2 MB", modified: "1 week ago" },
  ]

  return sampleFiles
}

export default function DriveContent({
  currentPath,
  setCurrentPath,
  searchQuery,
  viewMode,
}: DriveContentProps) {
  const directoryChildren = getDirectoryChildren(currentPath)

  const filteredFiles = useMemo(() => {
    return directoryChildren.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const handleFolderDoubleClick = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  return (
    <>
      {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <ContextMenu key={file.id}>
                <ContextMenuTrigger>
                  <div
                    className="group p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors relative"
                    onDoubleClick={() => {
                      if (file.type === "folder") {
                        handleFolderDoubleClick(file.name)
                      }
                    }}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="relative">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="w-full">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{file.modified}</p>
                        {file.size && <p className="text-xs text-muted-foreground">{file.size}</p>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Make a copy
                  </ContextMenuItem>
                  <ContextMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Move to trash
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2"></div>
            </div>
            {filteredFiles.map((file) => (
              <ContextMenu key={file.id}>
                <ContextMenuTrigger>
                  <div
                    className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group"
                    onDoubleClick={() => {
                      if (file.type === "folder") {
                        handleFolderDoubleClick(file.name)
                      }
                    }}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span className="font-medium">{file.name}</span>

                    </div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">{file.modified}</div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                      {file.size || "--"}
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Make a copy
                  </ContextMenuItem>
                  <ContextMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Move to trash
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
    </>
  )
}

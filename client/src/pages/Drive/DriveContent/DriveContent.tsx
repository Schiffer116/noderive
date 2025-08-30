import { Archive, FileText, Folder, ImageIcon, MoreVertical, Music, Video } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCallback, useMemo } from "react"

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"

import { useDriveContext } from "@/context/DriveContext"
import { DriveItemMenuContent } from "./MenuContent"
import { useChildren } from "@/hooks/useChildren"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

import { formatBytes, getFileURL } from "@/utils"

// function getFileIcon(type: string) {
//   switch (type) {
//     case "directory":
//       return <Folder className="w-8 h-8 text-blue-500" />
//     case "file":
//       return <FileText className="w-8 h-8 text-gray-500" />
//   }
// }

const getFileIcon = (filename: string, type: "directory" | "file") => {
  if (type === "directory") {
    return <Folder className="w-8 h-8 text-blue-500" />;
  }

  const ext = filename.split(".").pop()?.toLowerCase();

  switch (true) {
    case ["txt", "md", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext!):
      return <FileText className="w-8 h-8 text-red-500" />;

    case ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext!):
      return <ImageIcon className="w-8 h-8 text-green-500" />;

    case ["mp4", "mkv", "mov", "avi", "webm"].includes(ext!):
      return <Video className="w-8 h-8 text-purple-500" />;

    case ["mp3", "wav", "ogg", "flac", "aac"].includes(ext!):
      return <Music className="w-8 h-8 text-orange-500" />;

    case ["zip", "rar", "7z", "tar", "gz"].includes(ext!):
      return <Archive className="w-8 h-8 text-yellow-500" />;

    default:
      return <FileText className="w-8 h-8 text-gray-500" />;
  }
};


export default function DriveContent() {
  const navigate = useNavigate();
  const { viewMode, searchQuery } = useDriveContext();
  const { children } = useChildren();

  const filteredChildren = useMemo(() => {
    return children.filter((child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [children, searchQuery]);

  const toLocaleDate = useCallback((date: string) =>
    new Date(date).toLocaleDateString()
    , []);

  const handleDoubleClick = useCallback((child: typeof children[number]) => {
    return () => {
      if (child.type === "directory") {
        navigate(`/drive/${child.id}`)
      } else if (child.type === "file") {
        window.open(getFileURL(child.key))
      }
    }
  }, []);

  return (
    <>
      {viewMode === "grid" ? (
        <div className="h-full w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min content-start">
          {filteredChildren.map((child) => (
            <ContextMenu key={child.id}>
              <ContextMenuTrigger className="h-min" >
                <div
                  className="group p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors relative"
                  onDoubleClick={handleDoubleClick(child)}
                >
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className="relative">
                      {getFileIcon(child.name, child.type)}
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-medium truncate" title={child.name}>
                        {child.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{toLocaleDate(child.createdAt)}</p>
                      <p className="text-xs text-muted-foreground">{child.type === "file" ? formatBytes(child.size) : "--"}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DriveItemMenuContent
                      id={child.id}
                      name={child.name}
                      url={child.type === "directory" ? window.location.href : getFileURL(child.key)}
                      type={child.type}
                      variant="dropdown"
                    />
                  </DropdownMenu>
                </div>
              </ContextMenuTrigger>
              <DriveItemMenuContent
                id={child.id}
                name={child.name}
                type={child.type}
                url={child.type === "directory" ? window.location.href : getFileURL(child.key)}
                variant="context"
              />
            </ContextMenu>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Created at</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2"></div>
          </div>
          {filteredChildren.map((child) => (
            <ContextMenu key={child.id}>
              <ContextMenuTrigger>
                <div
                  className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group"
                  onDoubleClick={handleDoubleClick(child)}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    {getFileIcon(child.name, child.type)}
                    <span className="font-medium">{child.name}</span>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {toLocaleDate(child.createdAt)}
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {child.type === "file" ? formatBytes(child.size) : "--"}
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DriveItemMenuContent
                        id={child.id}
                        name={child.name}
                        url={child.type === "directory" ? window.location.href : getFileURL(child.key)}
                        type={child.type}
                        variant="dropdown"
                      />
                    </DropdownMenu>
                  </div>
                </div>
              </ContextMenuTrigger>
              <DriveItemMenuContent
                id={child.id}
                name={child.name}
                url={child.type === "directory" ? window.location.href : getFileURL(child.key)}
                type={child.type} variant="context"
              />
            </ContextMenu>
          ))}
        </div>
      )}
    </>
  )
}

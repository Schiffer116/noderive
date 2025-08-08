import { FileText, Folder, MoreVertical } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"

import { useDriveContext } from "@/context/DriveContext"
import { FileMenuContent, DirectoryMenuContent } from "./MenuContent"
import {  useChildren } from "@/hooks/useChildren"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

function getFileIcon(type: string) {
  switch (type) {
    case "directory":
      return <Folder className="w-8 h-8 text-blue-500" />
    case "file":
      return <FileText className="w-8 h-8 text-gray-500" />
  }
}

export default function DriveContent() {
  const navigate = useNavigate();
  const { searchQuery } = useDriveContext();
  const { viewMode } = useDriveContext();

  const { children } = useChildren();

  const filteredChildren = useMemo(() => {
    return children.filter((child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [children, searchQuery]);

  return (
    <>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredChildren.map((child) => (
            <ContextMenu key={child.id}>
              <ContextMenuTrigger>
                <div
                  className="group p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors relative"
                  onDoubleClick={() => {
                    if (child.type === "directory") {
                      navigate(`/drive/${child.id}`)
                    } else if (child.type === "file") {
                      window.open(child.url)
                    }
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      {getFileIcon(child.type)}
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-medium truncate" title={child.name}>
                        {child.name}
                      </p>
                      {/*
                        <p className="text-xs text-muted-foreground">{file.modified}</p>
                        {file.size && <p className="text-xs text-muted-foreground">{file.size}</p>}
                        */}
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
                    {
                      child.type === "directory"
                        ? <DirectoryMenuContent id={child.id} name={child.name} variant="dropdown" />
                        : <FileMenuContent id={child.id} name={child.name} url={child.url} variant="dropdown" />
                    }
                  </DropdownMenu>
                </div>
              </ContextMenuTrigger>
              {
                child.type === "directory"
                  ? <DirectoryMenuContent id={child.id} name={child.name} variant="context" />
                  : <FileMenuContent id={child.id} name={child.name} url={child.url} variant="context" />
              }
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
            {filteredChildren.map((child) => (
              <ContextMenu key={child.id}>
                <ContextMenuTrigger>
                  <div
                    className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer group"
                    onDoubleClick={() => {
                      if (child.type === "directory") {
                        navigate(`/drive/${child.id}`)
                      } else if (child.type === "file") {
                        window.open(child.url)
                      }
                    }}
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      {getFileIcon(child.type)}
                      <span className="font-medium">{child.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">{123}</div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                      {123}
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
                        {
                          child.type === "directory"
                            ? <DirectoryMenuContent id={child.id} name={child.name} variant="dropdown" />
                            : <FileMenuContent id={child.id} name={child.name} url={child.url} variant="dropdown" />
                        }
                      </DropdownMenu>
                    </div>
                  </div>
                </ContextMenuTrigger>
                {
                  child.type === "directory"
                    ? <DirectoryMenuContent id={child.id} name={child.name} variant="context" />
                    : <FileMenuContent id={child.id} name={child.name} url={child.url} variant="context" />
                }
              </ContextMenu>
            ))}
          </div>
        )}
    </>
  )
}

import { useState } from "react"
import { redirect, type LoaderFunctionArgs } from "react-router-dom";

import Header from "@/pages/Drive/Header"
import Breadcrumbs from "@/pages/Drive/Breadcrumbs"
import DriveContent from "@/pages/Drive/DriveContent"
import { DriveContext, type DriveContextType, type ViewMode } from "@/context/DriveContext";
import { Toaster } from "@/components/ui/sonner";

import { trpcClient } from "@/utils/trpc";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { NewItemMenuContent } from "./NewMenuContent";

export async function driveLoader({ params }: LoaderFunctionArgs) {
  let folderId = params.id;
  if (folderId === undefined) {
    const root = await trpcClient.directory.getRoot.query();
    return redirect(`/drive/${root.id}`)
  }

  const [children, path] = await Promise.all([
    trpcClient.directory.getChildren.query({ id: folderId }),
    trpcClient.directory.getPath.query({ id: folderId }),
  ]);

  return { children, path }
}


export default function Drive() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const contextValue: DriveContextType = {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
  };

  return (
    <DriveContext.Provider value={contextValue}>
      <div className="h-screen bg-background flex flex-col">
        <Toaster />
        <Header />
        <main className="flex-1 p-6">
          <ContextMenu>
            <ContextMenuTrigger>
              <Breadcrumbs />
              <DriveContent />
            </ContextMenuTrigger>
            <NewItemMenuContent variant="context" />
          </ContextMenu>
        </main>
      </div>
    </DriveContext.Provider>
  );
}

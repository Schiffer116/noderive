import { useState } from "react"
import { useParams, type LoaderFunctionArgs } from "react-router-dom";

import Header from "@/pages/Drive/Header"
import Breadcrumbs from "@/pages/Drive/Breadcrumbs"
import DriveContent from "@/pages/Drive/DriveContent"
import { DriveContext, type DriveContextType, type ViewMode } from "@/context/DriveContext";
import { fetchChildren, fetchPath } from "@/api";

export async function driveLoader({ params }: LoaderFunctionArgs) {
  const [children, path] = await Promise.all([
    fetchChildren(params.id!),
    fetchPath(params.id!),
  ]);

  if (path.length == 0) {
    throw new Error("The requested URL was not found on this server. That’s all we know.")
  }

  return { children, path }
}


export default function Drive() {
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  if (!id) {
    return "The requested URL was not found on this server. That’s all we know."
  }

  const contextValue: DriveContextType = {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
  };

  return (
    <DriveContext.Provider value={contextValue}>
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Breadcrumbs />
          <DriveContent />
        </main>
      </div>
    </DriveContext.Provider>
  );
}

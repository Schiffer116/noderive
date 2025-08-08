import { useState } from "react"
import { useParams, type LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod"

import Header from "@/pages/Drive/Header"
import Breadcrumbs from "@/pages/Drive/Breadcrumbs"
import DriveContent from "@/pages/Drive/DriveContent"
import { DriveContext, type DriveContextType, type ViewMode } from "@/context/DriveContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const DirectorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.literal("directory"),
});

const FileSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.url(),
  type: z.literal("file"),
});

export type DriveItem = z.infer<typeof DirectorySchema> | z.infer<typeof FileSchema>;

const PathSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export async function fetchChildren(id: string) {
  const uris = ["directory", "file"]
  const urls = uris
    .map(uri => new URL(uri, API_URL).href + "/")

  const [rawDirectories, rawFiles] = await Promise.all(
    urls.map(async (url, idx) => {
      const rawData = await fetch(new URL(id, url).href)
      let data = await rawData.json();

      return data.map((item: any) => ({ ...item, type: uris[idx] }))
    })
  );

  const directories = z.array(DirectorySchema).parse(rawDirectories);
  const files = z.array(FileSchema).parse(rawFiles);

  return [ ...directories, ...files ]
}

export async function fetchPath(id: string) {
  const url = new URL("path/", API_URL).href
  const rawPath = await fetch(new URL(id, url).href).then(res => res.json())
  const path = z.array(PathSchema).parse(rawPath);
  return path
}

export async function driveLoader({ params }: LoaderFunctionArgs) {
  const children = await fetchChildren(params.id!);
  const path = await fetchPath(params.id!);
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

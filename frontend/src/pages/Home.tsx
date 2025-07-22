import { useState } from "react"

import Header from "@/components/home/Header"
import Breadcrumbs from "@/components/home/Breadcrumbs"
import DriveContent from "@/components/home/DriveContent"

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>(["My Drive"])

  const navigateToPath = (pathIndex: number) => {
    setCurrentPath(currentPath.slice(0, pathIndex + 1))
  }

  return (
    <div className="h-screen bg-background">
      <div className="flex flex-col h-full">
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 p-6">
          <Breadcrumbs
            currentPath={currentPath}
            navigateToPath={navigateToPath}
          />

          <DriveContent
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            viewMode={viewMode}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </div>
  )
}

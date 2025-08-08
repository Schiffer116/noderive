import { createContext, useContext } from "react";

export type ViewMode = "grid" | "list";

export type DriveContextType = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const useDriveContext = () => {
  const ctx = useContext(DriveContext);
  if (!ctx) throw new Error("useHomeContext must be used within HomeProvider");
  return ctx;
};

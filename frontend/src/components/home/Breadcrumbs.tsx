import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Home } from "lucide-react"

type DriveBreadcrumbsProps = {
  currentPath: string[]
  navigateToPath: (index: number) => void
}

export default function Breadcrumbs({ currentPath, navigateToPath }: DriveBreadcrumbsProps) {
  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigateToPath(0)
              }}
              className="flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              {currentPath[0]}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentPath.slice(1).map((folder, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {index === currentPath.length - 2 ? (
                  <BreadcrumbPage>{folder}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="hover:text-blue-500"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      navigateToPath(index + 1)
                    }}
                  >
                    {folder}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}



import { Fragment } from "react";
import { ChevronRight } from "lucide-react"
import { useLoaderData, useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import type { driveLoader } from "@/pages/Drive";

export default function Breadcrumbs() {
  const navigate = useNavigate();
  const { path } = useLoaderData<typeof driveLoader>();

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate(`/drive/${path[0].id}`)
              }}
            >
              {path[0].name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {path.slice(1).map((folder, index) => (
            <Fragment key={index} >
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {index === path.length - 2 ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="hover:text-blue-500"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(`/drive/${folder.id}`)
                    }}
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

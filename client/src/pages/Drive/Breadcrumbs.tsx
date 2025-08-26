import { Fragment } from "react";
import { ChevronRight } from "lucide-react"
import { Link, useLoaderData, useNavigate, useNavigation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import type { driveLoader } from "./Drive";

export default function Breadcrumbs() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { path } = useLoaderData<typeof driveLoader>();

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/drive/${path[0].id}`}>
                {path[0].name}
              </Link>
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
          {
            navigation.state === 'loading' &&
            <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          }
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

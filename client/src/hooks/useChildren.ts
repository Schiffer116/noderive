import { useLoaderData, useParams } from "react-router-dom";

import { driveLoader, } from "@/pages/Drive";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useChildren() {
  const id = useParams<{ id: string }>().id!;
  const { children: initialData } = useLoaderData<typeof driveLoader>();
  const { data } = useQuery(trpc.directory.getChildren.queryOptions(
    { id },
    { initialData }
  ));


  return {
    children: data,
    createDirectory: useMutation(trpc.directory.createChild.mutationOptions()).mutateAsync,
    deleteDirectory: useMutation(trpc.directory.delete.mutationOptions()).mutateAsync,
    renameDirectory: useMutation(trpc.directory.rename.mutationOptions()).mutateAsync,

    renameFile: useMutation(trpc.file.rename.mutationOptions()).mutateAsync,
    deleteFile: useMutation(trpc.file.delete.mutationOptions()).mutateAsync,
  };
}

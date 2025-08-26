import { useLoaderData, useParams } from "react-router-dom";

import { driveLoader, } from "@/pages/Drive";
import { trpc, queryClient } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TRPCMutationOptions } from "@trpc/tanstack-react-query";

export function useChildren() {
  const id = useParams<{ id: string }>().id!;
  const { children: initialData } = useLoaderData<typeof driveLoader>();

  const { data } = useQuery(trpc.directory.getChildren.queryOptions(
    { id },
    { initialData },
  ))

  const childrenKey = trpc.directory.getChildren.queryKey();

  const generateMutationFn = (mutationOptions: TRPCMutationOptions<any>) => {
    return useMutation(mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: childrenKey })
      }
    })).mutateAsync
  }

  return {
    children: data,
    invalidateChildren: () => queryClient.invalidateQueries({ queryKey: childrenKey }),
    createDirectory: generateMutationFn(trpc.directory.createChild.mutationOptions),
    deleteDirectory: generateMutationFn(trpc.directory.delete.mutationOptions),
    renameDirectory: generateMutationFn(trpc.directory.rename.mutationOptions),

    renameFile: generateMutationFn(trpc.file.rename.mutationOptions),
    deleteFile: generateMutationFn(trpc.file.delete.mutationOptions),
  };
}

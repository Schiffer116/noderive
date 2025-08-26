import { useLoaderData, useParams } from "react-router-dom";

import { driveLoader, } from "@/pages/Drive";
import { trpc, queryClient } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TRPCMutationOptions } from "@trpc/tanstack-react-query";

export function useChildren() {
  const id = useParams<{ id: string }>().id!;
  const { children: initialData } = useLoaderData<typeof driveLoader>();

  const queryOptions = trpc.directory.getChildren.queryOptions(
    { id },
    { initialData },
  );
  const { data } = useQuery(queryOptions);

  const invalidateChildren = async () => {
    const key = trpc.directory.getChildren.queryKey();
    console.log(key);
    return await queryClient.invalidateQueries({ queryKey: key })
  }

  const generateMutationFn = (mutationOptions: TRPCMutationOptions<any>) => {
    return useMutation(mutationOptions({ onSuccess: async () => await invalidateChildren() }))
      .mutateAsync;
  }

  return {
    children: data,
    invalidateChildren,
    createDirectory: generateMutationFn(trpc.directory.createChild.mutationOptions),
    deleteDirectory: generateMutationFn(trpc.directory.delete.mutationOptions),
    renameDirectory: generateMutationFn(trpc.directory.rename.mutationOptions),

    renameFile: generateMutationFn(trpc.file.rename.mutationOptions),
    deleteFile: generateMutationFn(trpc.file.delete.mutationOptions),
  };
}

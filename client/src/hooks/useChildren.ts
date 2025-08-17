import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

import { driveLoader, } from "@/pages/Drive";
import { fetchChildren, type DriveItem } from "@/api";
import { API_URL } from "@/constants";

const DIR_URL = API_URL + "directory"
const FILE_URL = API_URL + "file"

export function useChildren() {
  const id = useParams<{ id: string }>().id!;
  const queryClient = useQueryClient();
  const { children: initialData } = useLoaderData<typeof driveLoader>();

  const { data } = useQuery<DriveItem[]>({
    queryKey: ["children", id],
    queryFn: () => fetchChildren(id),
    initialData
  });

  const invalidateChidren = () => {
    queryClient.invalidateQueries({ queryKey: ["children"] })
  }

  const createMutation = useMutation({
    mutationFn: createDirectory,
    onSuccess: invalidateChidren,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDirectory,
    onSuccess: invalidateChidren,
  })

  const renameMutation = useMutation({
    mutationFn: renameDirectory,
    onSuccess: invalidateChidren,
  })

  const renameFileMutation = useMutation({
    mutationFn: renameFile,
    onSuccess: invalidateChidren,
  })

  return {
    children: data,
    createDirectory: createMutation.mutate,
    deleteDirectory: deleteMutation.mutate,
    renameDirectory: renameMutation.mutate,
    renameFile: renameFileMutation.mutate,
  }
}

function createDirectory({ name, parent }: { name: string, parent: string }) {
  return axios.post(DIR_URL, { name, parent }, {
    headers: { "Content-Type": "application/json" },
  });
}

function deleteDirectory(id: string) {
  return axios.delete(DIR_URL, {
    headers: { "Content-Type": "application/json", },
    data: { id },
  });
}

function renameDirectory({ id, name }: { id: string, name: string }) {
  return axios.patch(DIR_URL, { id, name }, {
    headers: { "Content-Type": "application/json", },
  });
}

function renameFile({ id, name }: { id: number, name: string }) {
  return axios.patch(FILE_URL, { id, name }, {
    headers: { "Content-Type": "application/json", },
  });
}

import { z } from "zod";
import axios from "axios";
import { API_URL } from "@/constants";

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

export async function fetchChildren(id: string) {
  const uris = ["directory", "file"]
  const urls = uris
    .map(uri => API_URL + uri)

  const [rawDirectories, rawFiles] = await Promise.all(
    urls.map(async (url, idx) => {
      const data = (await axios(url + "/" + id)).data
      return data.map((item: any) => ({ ...item, type: uris[idx] }))
    })
  );

  const directories = z.array(DirectorySchema).parse(rawDirectories);
  const files = z.array(FileSchema).parse(rawFiles);

  return [ ...directories, ...files ]
}

const PathSchema = z.array(z.object({
 id: z.string(),
 name: z.string(),
}))

export async function fetchPath(id: string) {
  const url = API_URL + "path/" + id
  const rawPath = await fetch(url).then(res => res.json())
  const path = PathSchema.parse(rawPath);
  return path
}


import { z } from "zod";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const PathSchema = z.array(z.object({
 id: z.string(),
 name: z.string(),
}))

export async function fetchPath(id: string) {
  const url = new URL("path/", API_URL).href
  const rawPath = await fetch(new URL(id, url).href).then(res => res.json())
  const path = PathSchema.parse(rawPath);
  return path
}

import { APP_ID } from "@/constants"

export function getFileURL(key: string) {
  return `https://${APP_ID}.ufs.sh/f/${key}`
}

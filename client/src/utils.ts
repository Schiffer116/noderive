import { APP_ID } from "@/constants"

export function getFileURL(key: string) {
  return `https://${APP_ID}.ufs.sh/f/${key}`
}

export function parseFileSize(size: string): number {
  const match = size.match(/^(\d+)(B|KB|MB|GB)$/);
  if (!match) {
    throw new Error(`Invalid file size: ${size}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2] as "B" | "KB" | "MB" | "GB";

  const multipliers = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  };

  return value * multipliers[unit];
}


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

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${parseFloat(value.toFixed(dm))} ${sizes[i]}`;
}


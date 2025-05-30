import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuartion = (duration: number) => {
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(duration / 60000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const snakeCaseToTitle = (str: string) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

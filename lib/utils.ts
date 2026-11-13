import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  // Each level requires Level * 150 XP
  // Level 1: 0 - 150
  // Level 2: 151 - 450 (150 + 300)
  // Level 3: 451 - 900 (450 + 450)
  let level = 1;
  let accumulated = 0;
  let nextThreshold = 150;

  while (xp >= accumulated + nextThreshold) {
    accumulated += nextThreshold;
    level += 1;
    nextThreshold = level * 150;
  }

  const currentXp = xp - accumulated;
  const progress = Math.min(Math.round((currentXp / nextThreshold) * 100), 100);

  return {
    level,
    currentXp,
    nextLevelXp: nextThreshold,
    progress,
  };
}

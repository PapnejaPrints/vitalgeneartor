import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertFahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5 / 9;
}
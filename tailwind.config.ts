import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|button|card|drawer|form|input|listbox|modal|scroll-shadow|ripple|spinner|divider).js",
    "./node_modules/@heroui/theme/dist/components/(alert|badge|checkbox|dropdown|listbox|button|ripple|spinner|form|menu|divider|popover).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [nextui({
        layout: {

        },themes: {
            light: {
              colors: {
                primary: {
                  foreground: "#fefefe",DEFAULT: "#E5332A"
                }
              }
            }
        }
      }),heroui()],
} satisfies Config;

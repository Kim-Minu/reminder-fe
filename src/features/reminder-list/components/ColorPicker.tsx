"use client";

import { Check } from "lucide-react";

export const APPLE_COLORS = [
  { name: "Red",    hex: "#FF3B30" },
  { name: "Orange", hex: "#FF9500" },
  { name: "Yellow", hex: "#FFCC00" },
  { name: "Green",  hex: "#34C759" },
  { name: "Mint",   hex: "#00C7BE" },
  { name: "Teal",   hex: "#30B0C7" },
  { name: "Cyan",   hex: "#32ADE6" },
  { name: "Blue",   hex: "#007AFF" },
  { name: "Indigo", hex: "#5856D6" },
  { name: "Purple", hex: "#AF52DE" },
  { name: "Pink",   hex: "#FF2D55" },
  { name: "Brown",  hex: "#A2845E" },
  { name: "Gray",   hex: "#8E8E93" },
];

interface Props {
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {APPLE_COLORS.map((c) => (
        <button
          key={c.hex}
          title={c.name}
          onClick={() => onChange(c.hex)}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: c.hex }}
        >
          {value === c.hex && <Check size={14} color="white" strokeWidth={2.5} />}
        </button>
      ))}
    </div>
  );
}

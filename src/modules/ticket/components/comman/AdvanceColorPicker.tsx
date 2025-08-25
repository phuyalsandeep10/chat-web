'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';

interface AdvancedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tooltip: React.ReactNode;
}

export default function AdvancedColorPicker({
  color,
  onChange,
  tooltip,
}: AdvancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexValue, setHexValue] = useState(color);
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });

  const gradientRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<HTMLDivElement>(null);

  // --- Color Conversion Functions ---
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
    };
  };

  // --- Sync color prop to internal state ---
  useEffect(() => {
    setHexValue(color);
    const rgb = hexToRgb(color);
    setRgbValues(rgb);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }, [color]);

  // --- Update hex & RGB when HSL changes ---
  useEffect(() => {
    const rgb = hslToRgb(hue, saturation, lightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexValue(hex);
    setRgbValues(rgb);
  }, [hue, saturation, lightness]);

  // --- Mouse Handlers ---
  const handleGradientClick = (e: React.MouseEvent) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const newSaturation = ((e.clientX - rect.left) / rect.width) * 100;
    const newLightness = 100 - ((e.clientY - rect.top) / rect.height) * 100;
    setSaturation(Math.max(0, Math.min(100, newSaturation)));
    setLightness(Math.max(0, Math.min(100, newLightness)));
    const { r, g, b } = hslToRgb(hue, newSaturation, newLightness);
    onChange(rgbToHex(r, g, b));
  };

  const handleSpectrumClick = (e: React.MouseEvent) => {
    if (!spectrumRef.current) return;
    const rect = spectrumRef.current.getBoundingClientRect();
    const newHue = ((e.clientX - rect.left) / rect.width) * 360;
    setHue(Math.max(0, Math.min(360, newHue)));
    const { r, g, b } = hslToRgb(newHue, saturation, lightness);
    onChange(rgbToHex(r, g, b));
  };

  const handleHexChange = (value: string) => {
    setHexValue(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const rgb = hexToRgb(value);
      setRgbValues(rgb);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      onChange(value);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgbValues, [component]: num };
    setRgbValues(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexValue(hex);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    onChange(hex);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div
                className="border-grey-light h-8 w-8 cursor-pointer rounded border"
                style={{ backgroundColor: color }}
              />
            </DialogTrigger>
            <DialogContent className="w-80 space-y-4 p-6">
              <DialogTitle>Pick a Color</DialogTitle>

              {/* Saturation / Lightness Area */}
              <div
                ref={gradientRef}
                className="relative h-48 w-full cursor-crosshair rounded-lg"
                style={{
                  background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`,
                }}
                onClick={handleGradientClick}
              >
                <div
                  className="border-grey-light absolute h-4 w-4 -translate-x-2 -translate-y-2 rounded-full border shadow-lg"
                  style={{
                    left: `${saturation}%`,
                    top: `${100 - lightness}%`,
                    backgroundColor: hexValue,
                  }}
                />
              </div>

              {/* Hue Spectrum */}
              <div
                ref={spectrumRef}
                className="relative h-4 w-full cursor-pointer rounded-full"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
                onClick={handleSpectrumClick}
              >
                <div
                  className="rounded-ful border-grey-light absolute h-4 w-4 -translate-x-2 shadow-lg"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    backgroundColor: `hsl(${hue}, 100%, 50%)`,
                  }}
                />
              </div>

              {/* Input Fields */}
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="mt-5">
                  <input
                    value={hexValue}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="border-grey-light w-full rounded border px-2 py-1 text-xs"
                  />
                </div>
                {(['r', 'g', 'b'] as const).map((c) => (
                  <div key={c}>
                    <label className="font-outfit text-sm font-medium text-white">
                      {c.toUpperCase()}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgbValues[c]}
                      onChange={(e) => handleRgbChange(c, e.target.value)}
                      className="font-outfit border-#D4D4D4 w-full rounded border px-2 py-1 text-xs font-medium text-white"
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TooltipTrigger>
      {/* CUSTOM TOOLTIP STYLING */}
      <TooltipContent className="text-brand-dark rounded-md border bg-white p-2 shadow-lg before:bg-white">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

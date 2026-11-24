import type { CSSProperties, ChangeEvent } from 'react';

import { NumberField } from './ui';

interface UsersSliderProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function UsersSlider({ value, error, onChange }: UsersSliderProps) {
  const numericValue = Number(value);
  const sliderValue = Number.isFinite(numericValue)
    ? Math.min(Math.max(numericValue, 1), 500)
    : 1;
  const fill = ((sliderValue - 1) / 499) * 100;
  const sliderStyle = { '--fill': `${fill}%` } as CSSProperties;

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-label text-text">Usuarios</span>
        <span className="text-caption text-text-muted">Slider de 1 a 500</span>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start">
        <div className="order-2 md:order-1 md:col-span-8">
          <label className="sr-only" htmlFor="users-slider">
            Usuarios, slider de 1 a 500
          </label>
          <input
            aria-label="Usuarios, slider de 1 a 500"
            className="users-slider w-full"
            id="users-slider"
            max="500"
            min="1"
            style={sliderStyle}
            type="range"
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <div className="flex justify-between text-caption text-text-muted">
            <span>1</span>
            <span>250</span>
            <span>500</span>
          </div>
        </div>
        <NumberField
          containerClassName="order-1 md:order-2 md:col-span-4"
          error={error}
          label={<span className="sr-only">Número de usuarios</span>}
          max="100000"
          min="1"
          name="users"
          suffix="usuarios"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <button
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-bg"
      title={label}
      type="button"
      onClick={toggle}
    >
      {isDark ? (
        <Sun aria-hidden="true" size={20} />
      ) : (
        <Moon aria-hidden="true" size={20} />
      )}
    </button>
  );
}

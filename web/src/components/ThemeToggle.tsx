import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-bg md:h-11 md:w-11"
      title={label}
      type="button"
      onClick={toggle}
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} />
      ) : (
        <Moon aria-hidden="true" size={18} />
      )}
    </button>
  );
}

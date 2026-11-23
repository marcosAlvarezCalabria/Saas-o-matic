const DEFAULT_CORS_ORIGINS = ['http://localhost:5173'];

export function parseCorsOrigins(value: string | undefined): string[] {
  const origins = value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return origins === undefined || origins.length === 0 ? [...DEFAULT_CORS_ORIGINS] : origins;
}

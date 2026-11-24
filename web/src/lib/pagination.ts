interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageCount: number;
}

export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(Math.trunc(page), 1), pageCount);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: currentPage,
    pageCount,
  };
}

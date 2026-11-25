import { useRef } from 'react';

import type { Customer } from '../api/types';
import { paginate } from '../lib/pagination';
import { CustomerCard } from './CustomerCard';
import { Pagination } from './Pagination';

interface CustomerListProps {
  customers: Customer[];
  page: number;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE = 6;

export function CustomerList({
  customers,
  page,
  onPageChange,
}: CustomerListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const paginated = paginate(customers, page, PAGE_SIZE);

  function changePage(nextPage: number): void {
    onPageChange(nextPage);
    window.requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <div className="scroll-mt-36" ref={listRef}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginated.items.map((customer) => (
          <CustomerCard customer={customer} key={customer.id} />
        ))}
      </div>
      <Pagination
        ariaLabel="Paginación de clientes"
        className="mt-8"
        page={paginated.page}
        pageCount={paginated.pageCount}
        onPageChange={changePage}
      />
    </div>
  );
}

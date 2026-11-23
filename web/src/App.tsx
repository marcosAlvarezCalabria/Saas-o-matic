import { Route, Routes } from 'react-router';

import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/customers/:id" element={<CustomerDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

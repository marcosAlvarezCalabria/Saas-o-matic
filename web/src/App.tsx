import { Route, Routes } from 'react-router';

import { Layout } from './components/Layout';
import { CurrencyProvider } from './context/CurrencyContext';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <CurrencyProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </CurrencyProvider>
  );
}

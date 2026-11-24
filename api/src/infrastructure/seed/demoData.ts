export interface DemoSimulation {
  users: number;
  storageGb: number;
  apiCalls: number;
}

export interface DemoCustomer {
  companyName: string;
  taxId: string;
  email: string;
  country: string;
  plan: string;
  simulations: readonly DemoSimulation[];
}

export const DEMO_CUSTOMERS: readonly DemoCustomer[] = [
  {
    companyName: 'Nube Norte S.L.',
    taxId: 'B76432103',
    email: 'facturacion@nubenorte.example.com',
    country: 'ES',
    plan: 'pro',
    simulations: [
      { users: 5, storageGb: 20, apiCalls: 10_000 },
      { users: 10, storageGb: 50, apiCalls: 25_000 },
      { users: 12, storageGb: 80, apiCalls: 40_000 },
      { users: 25, storageGb: 150, apiCalls: 90_000 },
      { users: 40, storageGb: 200, apiCalls: 120_000 },
      { users: 60, storageGb: 400, apiCalls: 250_000 },
      { users: 120, storageGb: 1_000, apiCalls: 600_000 },
    ],
  },
  {
    companyName: 'Nube Sur Consultores S.L.',
    taxId: 'B91827360',
    email: 'admin@nubesur.example.com',
    country: 'ES',
    plan: 'basic',
    simulations: [
      { users: 3, storageGb: 10, apiCalls: 2_000 },
      { users: 8, storageGb: 30, apiCalls: 8_000 },
    ],
  },
  {
    companyName: 'Laura Gómez Ruiz',
    taxId: '48213576X',
    email: 'laura@gomezruiz.example.com',
    country: 'ES',
    plan: 'basic',
    simulations: [{ users: 1, storageGb: 5, apiCalls: 500 }],
  },
  {
    companyName: 'Taller Ibérico',
    taxId: 'X3958214Y',
    email: 'hola@talleriberico.example.com',
    country: 'ES',
    plan: 'pro',
    simulations: [],
  },
  {
    companyName: 'Construcciones Arganda S.A.',
    taxId: 'A28461531',
    email: 'compras@arganda.example.com',
    country: 'ES',
    plan: 'enterprise',
    simulations: [{ users: 45, storageGb: 300, apiCalls: 200_000 }],
  },
  {
    companyName: 'Datos Atlânticos Lda.',
    taxId: 'PT509876543',
    email: 'financeiro@atlanticos.example.com',
    country: 'PT',
    plan: 'pro',
    simulations: [
      { users: 20, storageGb: 100, apiCalls: 30_000 },
      { users: 35, storageGb: 250, apiCalls: 70_000 },
      { users: 55, storageGb: 300, apiCalls: 150_000 },
    ],
  },
  {
    companyName: 'Lumière Logiciels SAS',
    taxId: 'FR40123456789',
    email: 'compta@lumiere.example.com',
    country: 'FR',
    plan: 'enterprise',
    simulations: [
      { users: 75, storageGb: 500, apiCalls: 300_000 },
      { users: 150, storageGb: 2_000, apiCalls: 900_000 },
    ],
  },
  {
    companyName: 'Bergwerk Software GmbH',
    taxId: 'DE811234567',
    email: 'buchhaltung@bergwerk.example.com',
    country: 'DE',
    plan: 'enterprise',
    simulations: [
      { users: 200, storageGb: 3_000, apiCalls: 1_500_000 },
      { users: 500, storageGb: 8_000, apiCalls: 4_000_000 },
    ],
  },
  {
    companyName: 'Nordvik Analytics AB',
    taxId: 'SE556123456701',
    email: 'ekonomi@nordvik.example.com',
    country: 'SE',
    plan: 'pro',
    simulations: [{ users: 30, storageGb: 120, apiCalls: 60_000 }],
  },
];

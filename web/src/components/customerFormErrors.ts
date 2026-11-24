import { ApiError } from '../api/apiClient';

export interface CustomerFormErrors {
  form?: string;
  country?: string;
  taxId?: string;
}

export function getCustomerFormErrors(error: unknown): CustomerFormErrors {
  if (error instanceof ApiError) {
    if (error.code === 'INVALID_TAX_ID') {
      return { taxId: 'El identificador fiscal no es válido para ese país.' };
    }
    if (error.code === 'TAX_ID_ALREADY_EXISTS') {
      return { taxId: 'Ya existe un cliente con ese identificador fiscal.' };
    }
    if (error.code === 'COUNTRY_NOT_SUPPORTED') {
      return { country: 'No hay IVA definido para ese país.' };
    }
    if (error.code === 'VALIDATION_ERROR') {
      return { form: error.message };
    }
    if (error.status === 429 || error.code === 'RATE_LIMITED') {
      return {
        form: 'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.',
      };
    }
  }

  return { form: 'No se pudo guardar. Inténtalo de nuevo.' };
}

import { COUNTRIES } from '../lib/countries';
import type { CustomerFormErrors } from './customerFormErrors';
import { CustomerPlanField } from './CustomerPlanField';
import { InlineAlert, SelectField, TextField } from './ui';

interface CustomerFormFieldsProps {
  errors: CustomerFormErrors;
  clearCountryError: () => void;
  clearTaxIdError: () => void;
}

export function CustomerFormFields({
  errors,
  clearCountryError,
  clearTaxIdError,
}: CustomerFormFieldsProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {errors.form ? (
        <InlineAlert variant="error">{errors.form}</InlineAlert>
      ) : null}
      <TextField
        autoFocus
        label="Nombre de la empresa"
        name="companyName"
        required
      />
      <SelectField
        defaultValue=""
        error={errors.country}
        label="País fiscal"
        name="country"
        required
        onChange={clearCountryError}
      >
        <option disabled value="">
          Selecciona un país
        </option>
        {COUNTRIES.map(({ code, name }) => (
          <option key={code} value={code}>
            {name} ({code})
          </option>
        ))}
      </SelectField>
      <TextField
        error={errors.taxId}
        label="Identificador fiscal (NIF / CIF)"
        name="taxId"
        required
        onChange={clearTaxIdError}
      />
      <TextField
        label="Email corporativo"
        name="email"
        required
        type="email"
      />
      <CustomerPlanField />
    </div>
  );
}

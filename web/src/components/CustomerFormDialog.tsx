import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router';

import { createCustomer } from '../api/customers';
import type { CountryCode, CreateCustomerInput, Plan } from '../api/types';
import {
  getCustomerFormErrors,
  type CustomerFormErrors,
} from './customerFormErrors';
import { CustomerFormFields } from './CustomerFormFields';
import { Button, Icon } from './ui';

interface CustomerFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CustomerFormDialog({
  open,
  onClose,
}: CustomerFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<CustomerFormErrors>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      const firstField = formRef.current?.elements.namedItem('companyName');
      if (firstField instanceof HTMLElement) {
        firstField.focus();
      }
    } else if (!open && dialog?.open) {
      dialog.close();
    }
  }, [open]);

  const closeDialog = () => dialogRef.current?.close();

  const handleClose = () => {
    formRef.current?.reset();
    submittingRef.current = false;
    setSubmitting(false);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrors({});

    const data = new FormData(event.currentTarget);
    const input: CreateCustomerInput = {
      companyName: String(data.get('companyName')),
      country: String(data.get('country')) as CountryCode,
      taxId: String(data.get('taxId')),
      email: String(data.get('email')),
      plan: String(data.get('plan')) as Plan,
    };

    try {
      const customer = await createCustomer(input);
      closeDialog();
      navigate(`/customers/${customer.id}`);
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);
      setErrors(getCustomerFormErrors(error));
    }
  };

  return (
    <dialog
      aria-labelledby="customer-dialog-title"
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-screen w-full max-w-none overflow-y-auto rounded-t-2xl border border-border bg-surface p-0 text-text backdrop:bg-scrim md:inset-0 md:m-auto md:max-w-lg md:rounded-card"
      ref={dialogRef}
      onCancel={(event) => {
        if (submittingRef.current) {
          event.preventDefault();
        }
      }}
      onClose={handleClose}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="p-4 md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-title-md" id="customer-dialog-title">
                Nuevo cliente
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Datos fiscales y de contacto del cliente.
              </p>
            </div>
            <button
              aria-label="Cerrar"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
              disabled={submitting}
              type="button"
              onClick={closeDialog}
            >
              <Icon icon={X} size={20} />
            </button>
          </div>

          <CustomerFormFields
            clearCountryError={() =>
              setErrors((current) => ({ ...current, country: undefined }))
            }
            clearTaxIdError={() =>
              setErrors((current) => ({ ...current, taxId: undefined }))
            }
            errors={errors}
          />

          <div className="mt-6 flex gap-3 border-t border-border pt-6 md:justify-end">
            <Button
              className="flex-1 md:flex-none"
              disabled={submitting}
              variant="secondary"
              onClick={closeDialog}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 md:flex-none"
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Guardando…' : 'Guardar cliente'}
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

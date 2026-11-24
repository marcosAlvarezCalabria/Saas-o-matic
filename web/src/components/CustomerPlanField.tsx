import type { Plan } from '../api/types';

const PLANS: { label: string; value: Plan }[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

export function CustomerPlanField() {
  return (
    <fieldset>
      <legend className="mb-1.5 text-label text-text">Plan</legend>
      <div className="grid grid-cols-3 gap-2">
        {PLANS.map(({ label, value }) => (
          <label className="cursor-pointer" key={value}>
            <input
              className="peer sr-only"
              name="plan"
              required
              type="radio"
              value={value}
            />
            <span className="flex h-11 items-center justify-center rounded-field border border-input-border bg-surface text-sm text-text peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-link peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-link">
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

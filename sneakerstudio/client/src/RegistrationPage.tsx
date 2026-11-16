// Registrierung (F03–F05): Formular „Konto erstellen“ mit Kontaktdaten (F03) und Passwort (F04);
// „Konto anlegen“ beauftragt die Kontoanlage beim Server (F05).
// Regeln und Hinweistexte stammen aus shared; ein Hinweis erscheint, sobald ein Feld verlassen wurde.

import { SALUTATIONS, validateContact, type ContactData } from '@sneakerstudio/shared/contact';
import { validatePassword, validatePasswordConfirmation } from '@sneakerstudio/shared/password';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';

type FormValues = ContactData & { password: string; passwordConfirmation: string };
type FormField = keyof FormValues;
type FormErrors = Partial<Record<FormField, string>>;

const EMPTY_FORM: FormValues = {
  salutation: '',
  firstName: '',
  lastName: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
};

const CONTROL_CLASS =
  'mt-1 block w-full rounded-md border border-field-line bg-field px-3 py-2 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-danger';

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = validateContact(values);
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  const confirmationError = validatePasswordConfirmation(values.password, values.passwordConfirmation);
  if (confirmationError) errors.passwordConfirmation = confirmationError;
  return errors;
}

type SubmitResult = { created: true } | { created: false; errors: FormErrors };

// Die Passwort-Wiederholung prüft nur der Client (F04) – sie wird nicht mitgesendet.
async function submitRegistration(values: FormValues): Promise<SubmitResult> {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...values, passwordConfirmation: undefined }),
  });
  if (response.ok) return { created: true };
  if (response.status === 409 || response.status === 422) {
    const { errors } = (await response.json()) as { errors: FormErrors };
    return { created: false, errors };
  }
  throw new Error(`Kontoanlage fehlgeschlagen: HTTP ${response.status}`);
}

export function RegistrationPage() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<FormErrors>({});
  const registration = useMutation({
    mutationFn: submitRegistration,
    onSuccess: (result) => {
      if (!result.created) setServerErrors(result.errors);
    },
  });
  const errors = validateForm(values);
  const isValid = Object.keys(errors).length === 0 && Object.keys(serverErrors).length === 0;

  const bind = (name: FormField) => ({
    id: name,
    name,
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      // Ein Server-Hinweis bezieht sich auf den alten Wert und entfällt mit jeder Änderung.
      setServerErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    },
    onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
    error: serverErrors[name] ?? (touched[name] ? errors[name] : undefined),
  });

  const heading = (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Konto erstellen</h1>
      <div className="mt-4 h-1 w-12 bg-brand" aria-hidden="true" />
    </>
  );

  if (registration.data?.created) {
    return (
      <section>
        {heading}
        <Confirmation />
      </section>
    );
  }

  return (
    <section>
      {heading}
      <p className="mt-4 text-muted">Alle Felder außer der Telefonnummer sind Pflichtfelder.</p>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid && !registration.isPending) registration.mutate(values);
        }}
        className="mt-8 max-w-2xl space-y-8 rounded-xl border border-line bg-surface p-6 sm:p-8"
      >
        <Group legend="Persönliche Daten">
          <SelectField label="Anrede" {...bind('salutation')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Vorname" autoComplete="given-name" {...bind('firstName')} />
            <TextField label="Nachname" autoComplete="family-name" {...bind('lastName')} />
          </div>
        </Group>

        <Group legend="Adresse">
          <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
            <TextField label="Straße" {...bind('street')} />
            <TextField label="Hausnummer" {...bind('houseNumber')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-[9rem_1fr]">
            <TextField label="PLZ" inputMode="numeric" autoComplete="postal-code" {...bind('postalCode')} />
            <TextField label="Ort" autoComplete="address-level2" {...bind('city')} />
          </div>
        </Group>

        <Group legend="Kontakt">
          <TextField label="E-Mail-Adresse" type="email" autoComplete="email" {...bind('email')} />
          <TextField label="Telefonnummer (optional)" type="tel" autoComplete="tel" {...bind('phone')} />
        </Group>

        <Group legend="Passwort">
          <TextField
            label="Passwort"
            type="password"
            autoComplete="new-password"
            help="Mindestens 8 Zeichen, ein Sonderzeichen, ein Großbuchstabe und eine Zahl"
            {...bind('password')}
          />
          <TextField
            label="Passwort wiederholen"
            type="password"
            autoComplete="new-password"
            {...bind('passwordConfirmation')}
          />
        </Group>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!isValid || registration.isPending}
            className="rounded-md bg-primary px-6 py-3 text-sm font-bold tracking-wider text-on-primary uppercase enabled:hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Konto anlegen
          </button>
          {registration.isPending && (
            <p role="status" className="text-sm text-muted">
              Deine Kontoanlage ist in Bearbeitung.
            </p>
          )}
          {registration.isError && (
            <p role="alert" className="text-sm text-danger">
              Die Kontoanlage ist fehlgeschlagen. Bitte versuche es später erneut.
            </p>
          )}
        </div>
      </form>

      <p className="mt-6 text-sm text-muted">
        Bereits ein Konto?{' '}
        <Link to="/anmelden" className="font-semibold text-accent hover:underline">
          Anmelden
        </Link>
      </p>
    </section>
  );
}

// Bestätigung nach erfolgreicher Verifizierung (UC 1.3.2; Folie 8, Schritt 3).
function Confirmation() {
  return (
    <div className="mt-8 max-w-2xl rounded-xl border border-line bg-surface p-8 text-center">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="mx-auto size-16 text-accent"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" />
        <rect x="13" y="16" width="22" height="16" rx="2" />
        <path d="m13 18 11 8 11-8" />
      </svg>
      <p role="status" className="mt-6 font-semibold text-accent">
        Deine Kontaktdaten wurden erfolgreich verifiziert.
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Bitte bestätige deine E-Mail-Adresse</h2>
      <p className="mt-3 text-muted">
        Wir haben dir eine E-Mail mit einem Bestätigungslink gesendet. Der Link ist 24 Stunden gültig.
      </p>
    </div>
  );
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 text-sm font-semibold tracking-wider text-muted uppercase">{legend}</legend>
      {children}
    </fieldset>
  );
}

type FieldProps = { id: string; label: string; error?: string; help?: string };

// Label, Eingabe und darunter Hinweis oder Hilfetext – per aria-describedby mit der Eingabe verknüpft.
function Field({ id, label, error, help, children }: FieldProps & { children: (aria: object) => ReactNode }) {
  const note = error ?? help;
  const noteId = `${id}-${error ? 'hinweis' : 'hilfe'}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({ 'aria-invalid': error ? true : undefined, 'aria-describedby': note ? noteId : undefined })}
      {note && (
        <p id={noteId} className={`mt-1 text-sm ${error ? 'text-danger' : 'text-muted'}`}>
          {note}
        </p>
      )}
    </div>
  );
}

function TextField({ label, error, help, ...input }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field id={input.id} label={label} error={error} help={help}>
      {(aria) => <input {...input} {...aria} className={CONTROL_CLASS} />}
    </Field>
  );
}

function SelectField({ label, error, ...select }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field id={select.id} label={label} error={error}>
      {(aria) => (
        <select {...select} {...aria} className={CONTROL_CLASS}>
          <option value="" disabled>
            Bitte wählen
          </option>
          {SALUTATIONS.map((salutation) => (
            <option key={salutation.value} value={salutation.value}>
              {salutation.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

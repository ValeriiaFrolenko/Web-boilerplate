import { useState } from 'react';
import type { TypedUserFields, User, ValidationError } from '../logic/types';
import { buildUser } from '../logic/buildUser';
import validateUser from '../logic/validateUser';
import { parseDate, parseNumberOrNull, parseStringOrNull } from '../logic/normalizeUser';

interface AddTeacherModalProps {
  onClose: () => void;
  onSubmit: (user: User) => void;
}

interface FormState {
  fullName: string;
  gender: string;
  country: string;
  city: string;
  state: string;
  age: string;
  birthDate: string;
  email: string;
  phone: string;
  note: string;
}

const EMPTY_FORM: FormState = {
  fullName: '',
  gender: '',
  country: '',
  city: '',
  state: '',
  age: '',
  birthDate: '',
  email: '',
  phone: '',
  note: '',
};

const toTypedFields = (form: FormState): TypedUserFields => ({
  fullName: parseStringOrNull(form.fullName),
  gender: parseStringOrNull(form.gender),
  title: null,

  city: parseStringOrNull(form.city),
  state: parseStringOrNull(form.state),
  country: parseStringOrNull(form.country),
  postcode: null,

  coordinates: { latitude: null, longitude: null },
  timezone: { offset: null, description: null },

  email: parseStringOrNull(form.email),
  birthDate: form.birthDate === '' ? null : parseDate(form.birthDate),
  age: parseNumberOrNull(form.age),

  phone: parseStringOrNull(form.phone),
  pictureLarge: null,
  pictureThumbnail: null,

  favorite: false,
  course: null,
  bgColor: null,
  note: parseStringOrNull(form.note),
});

const AddTeacherModal = ({ onClose, onSubmit }: AddTeacherModalProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const updateField = (field: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const errorFor = (field: string): string | null =>
    errors.find((error) => error.field === field)?.message ?? null;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const candidate = buildUser(toTypedFields(form));
    const result = validateUser(candidate);

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    onSubmit(candidate);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal modal--form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="modal__close" onClick={onClose}>
          ×
        </button>

        <h2>Додати викладача</h2>

        <label>
          Повне ім'я
          <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
          {errorFor('fullName') && <span className="form-error">{errorFor('fullName')}</span>}
        </label>

        <label>
          Стать
          <input value={form.gender} onChange={(e) => updateField('gender', e.target.value)} />
          {errorFor('gender') && <span className="form-error">{errorFor('gender')}</span>}
        </label>

        <label>
          Країна
          <input value={form.country} onChange={(e) => updateField('country', e.target.value)} />
          {errorFor('country') && <span className="form-error">{errorFor('country')}</span>}
        </label>

        <label>
          Місто
          <input value={form.city} onChange={(e) => updateField('city', e.target.value)} />
          {errorFor('city') && <span className="form-error">{errorFor('city')}</span>}
        </label>

        <label>
          Область / штат
          <input value={form.state} onChange={(e) => updateField('state', e.target.value)} />
          {errorFor('state') && <span className="form-error">{errorFor('state')}</span>}
        </label>

        <label>
          Вік
          <input type="number" value={form.age} onChange={(e) => updateField('age', e.target.value)} />
          {errorFor('age') && <span className="form-error">{errorFor('age')}</span>}
        </label>

        <label>
          Дата народження
          <input type="date" value={form.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} />
        </label>

        <label>
          Email
          <input value={form.email} onChange={(e) => updateField('email', e.target.value)} />
          {errorFor('email') && <span className="form-error">{errorFor('email')}</span>}
        </label>

        <label>
          Телефон
          <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          {errorFor('phone') && <span className="form-error">{errorFor('phone')}</span>}
        </label>

        <label>
          Коментар
          <input value={form.note} onChange={(e) => updateField('note', e.target.value)} />
          {errorFor('note') && <span className="form-error">{errorFor('note')}</span>}
        </label>

        <button type="submit" className="button button--primary">
          Додати
        </button>
      </form>
    </div>
  );
};

export default AddTeacherModal;

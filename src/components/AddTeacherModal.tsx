import { useEffect, useState, type SubmitEvent } from 'react';
import type { TypedUserFields, User, ValidationError } from '../logic/types';
import { constructUserFromForm } from '../logic/buildUser';
import validateUser from '../logic/validateUser';
import { parseNumberOrNull, parseStringOrNull, COURSES } from '../logic/normalizeUser';
import { countries } from 'countries-list';

const COUNTRY_OPTIONS: string[] = Object.values(countries)
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));

interface AddTeacherModalProps {
    onClose: () => void;
    onSubmit: (user: User) => Promise<void>;
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
    course: string;
    bgColor: string;
    favorite: boolean;
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
    course: COURSES[0],
    bgColor: '#ffffff',
    favorite: false,
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
    birthDate: form.birthDate === '' ? null : form.birthDate,
    age: parseNumberOrNull(form.age),

    phone: parseStringOrNull(form.phone),
    pictureLarge: null,
    pictureThumbnail: null,

    favorite: form.favorite,
    course: form.course,
    bgColor: form.bgColor,
    note: form.note,
});

type StringField =
    | 'fullName' | 'gender' | 'country' | 'city' | 'state'
    | 'age' | 'birthDate' | 'email' | 'phone' | 'note'
    | 'course' | 'bgColor';

const AddTeacherModal = ({ onClose, onSubmit }: AddTeacherModalProps) => {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        setErrors(validateUser(toTypedFields(form)).errors);
    }, [form]);

    const errorFor = (field: string): string | null =>
        errors.find((error) => error.field === field)?.message ?? null;

    const updateString = (field: StringField, value: string): void => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateFavorite = (value: boolean): void => {
        setForm((prev) => ({ ...prev, favorite: value }));
    };

    const handleSubmit = async (e: SubmitEvent): Promise<void> => {
        e.preventDefault();

        const typed = toTypedFields(form);
        const result = validateUser(typed);
        setErrors(result.errors);
        if (!result.valid) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit(constructUserFromForm(typed));
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to save teacher');
        } finally {
            setIsSubmitting(false);
        }
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
                    <input value={form.fullName} onChange={(e) => updateString('fullName', e.target.value)} />
                    {errorFor('fullName') && <span className="form-error">{errorFor('fullName')}</span>}
                </label>

                <label>
                    Стать
                    <select value={form.gender} onChange={(e) => updateString('gender', e.target.value)}>
                        <option value="">Оберіть стать</option>
                        <option value="Male">Чоловіча</option>
                        <option value="Female">Жіноча</option>
                    </select>
                    {errorFor('gender') && <span className="form-error">{errorFor('gender')}</span>}
                </label>

                <label>
                    Країна
                    <select value={form.country} onChange={(e) => updateString('country', e.target.value)}>
                        <option value="">Оберіть країну</option>
                        {COUNTRY_OPTIONS.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    {errorFor('country') && <span className="form-error">{errorFor('country')}</span>}
                </label>

                <label>
                    Місто
                    <input value={form.city} onChange={(e) => updateString('city', e.target.value)} />
                    {errorFor('city') && <span className="form-error">{errorFor('city')}</span>}
                </label>

                <label>
                    Область / штат
                    <input value={form.state} onChange={(e) => updateString('state', e.target.value)} />
                    {errorFor('state') && <span className="form-error">{errorFor('state')}</span>}
                </label>

                <label>
                    Вік
                    <input type="number" value={form.age} onChange={(e) => updateString('age', e.target.value)} />
                    {errorFor('age') && <span className="form-error">{errorFor('age')}</span>}
                </label>

                <label>
                    Дата народження
                    <input type="date" value={form.birthDate} onChange={(e) => updateString('birthDate', e.target.value)} />
                    {errorFor('birthDate') && <span className="form-error">{errorFor('birthDate')}</span>}
                </label>

                <label>
                    Email
                    <input value={form.email} onChange={(e) => updateString('email', e.target.value)} />
                    {errorFor('email') && <span className="form-error">{errorFor('email')}</span>}
                </label>

                <label>
                    Телефон (тільки цифри)
                    <input value={form.phone} onChange={(e) => updateString('phone', e.target.value)} />
                    {errorFor('phone') && <span className="form-error">{errorFor('phone')}</span>}
                </label>

                <label>
                    Спеціальність
                    <select value={form.course} onChange={(e) => updateString('course', e.target.value)}>
                        {COURSES.map((course) => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Колір фону
                    <input type="color" value={form.bgColor} onChange={(e) => updateString('bgColor', e.target.value)} />
                </label>

                <label>
                    Обране
                    <input type="checkbox" checked={form.favorite} onChange={(e) => updateFavorite(e.target.checked)} />
                </label>

                <label>
                    Коментар
                    <input value={form.note} onChange={(e) => updateString('note', e.target.value)} />
                    {errorFor('note') && <span className="form-error">{errorFor('note')}</span>}
                </label>

                {submitError && <p className="form-error">{submitError}</p>}

                <button type="submit" className="button button--primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Збереження…' : 'Додати'}
                </button>
            </form>
        </div>
    );
};

export default AddTeacherModal;
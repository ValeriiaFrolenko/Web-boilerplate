import { useEffect, useState, type SubmitEvent } from 'react';
import type { TypedUserFields, User, ValidationError } from '../logic/types';
import { constructUserFromForm } from '../logic/buildUser';
import validateUser from '../logic/validateUser';
import { parseStringOrNull, parsePhone, COURSES } from '../logic/normalizeUser';
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
    birthDate: string;
    email: string;
    phone: string;
    course: string;
    bgColor: string;
    note: string;
    favorite: boolean;
}

const EMPTY_FORM: FormState = {
    fullName: '',
    gender: '',
    country: '',
    city: '',
    state: '',
    birthDate: '',
    email: '',
    phone: '',
    course: COURSES[0],
    bgColor: '#ffffff',
    note: '',
    favorite: false,
};

const computeAge = (birthDate: string): number | null => {
    if (birthDate === '') return null;
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
    }
    return age;
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
    age: computeAge(form.birthDate),

    phone: parsePhone(form.phone),
    pictureLarge: null,
    pictureThumbnail: null,

    favorite: form.favorite,
    course: form.course,
    bgColor: form.bgColor,
    note: form.note,
});

type StringField =
    | 'fullName' | 'gender' | 'country' | 'city' | 'state'
    | 'birthDate' | 'email' | 'phone' | 'note' | 'course' | 'bgColor';

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

    const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) onClose();
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
        <div className="modal" onMouseDown={handleOverlayMouseDown}>
            <div className="modal__window modal__window--form">
                <div className="modal__header">
                    <h2 className="modal__title">Add Teacher</h2>
                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form className="modal__body form" onSubmit={handleSubmit}>
                    <label className="form__label" htmlFor="add-name">Name</label>
                    <input
                        className="form__input"
                        id="add-name"
                        type="text"
                        placeholder="Enter name"
                        value={form.fullName}
                        onChange={(e) => updateString('fullName', e.target.value)}
                    />
                    {errorFor('fullName') !== null && (
                        <span className="form__field-error">{errorFor('fullName')}</span>
                    )}

                    <label className="form__label" htmlFor="add-specialty">Specialty</label>
                    <select
                        className="form__input"
                        id="add-specialty"
                        value={form.course}
                        onChange={(e) => updateString('course', e.target.value)}
                    >
                        {COURSES.map((course) => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>

                    <div className="form__row">
                        <div>
                            <label className="form__label" htmlFor="add-country">Country</label>
                            <select
                                className="form__input"
                                id="add-country"
                                value={form.country}
                                onChange={(e) => updateString('country', e.target.value)}
                            >
                                <option value="">Select country</option>
                                {COUNTRY_OPTIONS.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            {errorFor('country') !== null && (
                                <span className="form__field-error">{errorFor('country')}</span>
                            )}
                        </div>
                        <div>
                            <label className="form__label" htmlFor="add-city">City</label>
                            <input
                                className="form__input"
                                id="add-city"
                                type="text"
                                value={form.city}
                                onChange={(e) => updateString('city', e.target.value)}
                            />
                            {errorFor('city') !== null && (
                                <span className="form__field-error">{errorFor('city')}</span>
                            )}
                        </div>
                    </div>

                    <label className="form__label" htmlFor="add-state">State / Region</label>
                    <input
                        className="form__input"
                        id="add-state"
                        type="text"
                        value={form.state}
                        onChange={(e) => updateString('state', e.target.value)}
                    />
                    {errorFor('state') !== null && (
                        <span className="form__field-error">{errorFor('state')}</span>
                    )}

                    <div className="form__row">
                        <div>
                            <label className="form__label" htmlFor="add-email">Email</label>
                            <input
                                className="form__input"
                                id="add-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => updateString('email', e.target.value)}
                            />
                            {errorFor('email') !== null && (
                                <span className="form__field-error">{errorFor('email')}</span>
                            )}
                        </div>
                        <div>
                            <label className="form__label" htmlFor="add-phone">Phone</label>
                            <input
                                className="form__input"
                                id="add-phone"
                                type="tel"
                                value={form.phone}
                                onChange={(e) => updateString('phone', e.target.value)}
                            />
                            {errorFor('phone') !== null && (
                                <span className="form__field-error">{errorFor('phone')}</span>
                            )}
                        </div>
                    </div>

                    <label className="form__label" htmlFor="add-birth">Date of birth</label>
                    <input
                        className="form__input form__input--half"
                        id="add-birth"
                        type="date"
                        value={form.birthDate}
                        onChange={(e) => updateString('birthDate', e.target.value)}
                    />
                    {errorFor('birthDate') !== null && (
                        <span className="form__field-error">{errorFor('birthDate')}</span>
                    )}

                    <fieldset className="form__sex">
                        <legend className="form__label">Sex</legend>
                        <label className="form__radio">
                            <input
                                type="radio"
                                name="sex"
                                value="Male"
                                checked={form.gender === 'Male'}
                                onChange={(e) => updateString('gender', e.target.value)}
                            />
                            Male
                        </label>
                        <label className="form__radio">
                            <input
                                type="radio"
                                name="sex"
                                value="Female"
                                checked={form.gender === 'Female'}
                                onChange={(e) => updateString('gender', e.target.value)}
                            />
                            Female
                        </label>
                    </fieldset>
                    {errorFor('gender') !== null && (
                        <span className="form__field-error">{errorFor('gender')}</span>
                    )}

                    <div className="form__color">
                        <label className="form__label" htmlFor="add-color">Background color</label>
                        <input
                            id="add-color"
                            type="color"
                            value={form.bgColor}
                            onChange={(e) => updateString('bgColor', e.target.value)}
                        />
                    </div>

                    <label className="form__radio">
                        <input
                            type="checkbox"
                            checked={form.favorite}
                            onChange={(e) => setForm((prev) => ({ ...prev, favorite: e.target.checked }))}
                        />
                        Add to favorites
                    </label>

                    <label className="form__label" htmlFor="add-notes">Notes (optional)</label>
                    <textarea
                        className="form__input form__textarea"
                        id="add-notes"
                        rows={5}
                        value={form.note}
                        onChange={(e) => updateString('note', e.target.value)}
                    />
                    {errorFor('note') !== null && (
                        <span className="form__field-error">{errorFor('note')}</span>
                    )}

                    {submitError !== null && <p className="form__error">{submitError}</p>}

                    <button className="btn btn--submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving…' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;

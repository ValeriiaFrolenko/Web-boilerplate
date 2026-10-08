const isBlank = (value) => value === null || value === undefined || String(value).trim() === '';

const toNumberOrNull = (value) => {
  if (isBlank(value)) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const toStringOrNull = (value) => {
  if (isBlank(value)) return null;
  return String(value);
};

const capitalizeFirst = (value) => {
  if (isBlank(value)) return null;
  const str = String(value).trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const normalizeFullName = (value) => {
  if (isBlank(value)) return null;
  return String(value).trim().replace(/\s+/g, ' ');
};

const normalizeNote = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (str === '') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const normalizeDate = (value) => {
  if (isBlank(value)) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10); // YYYY-MM-DD, без часу
};

const normalizePhone = (value) => {
  if (isBlank(value)) return null;
  const digits = String(value).replace(/\D/g, '');
  return digits === '' ? null : digits;
};

const normalizeEmail = (value) => {
  if (isBlank(value)) return null;
  return String(value).trim().toLowerCase();
};

// Рахує повний вік (у роках) на сьогодні за нормалізованою датою народження (YYYY-MM-DD).
const calculateAge = (normalizedBirthDate) => {
  const birthDate = new Date(normalizedBirthDate);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
};

const normalizeUserFields = (mapped) => {
  const b_date = normalizeDate(mapped.b_date);

  return {
    gender: capitalizeFirst(mapped.gender),
    title: toStringOrNull(mapped.title),
    full_name: normalizeFullName(mapped.full_name),
    city: toStringOrNull(mapped.city),
    state: toStringOrNull(mapped.state),
    country: toStringOrNull(mapped.country),
    postcode: toStringOrNull(mapped.postcode),

    latitude: toNumberOrNull(mapped.latitude),
    longitude: toNumberOrNull(mapped.longitude),

    tz_offset: toStringOrNull(mapped.tz_offset),
    tz_description: toStringOrNull(mapped.tz_description),

    email: normalizeEmail(mapped.email),
    b_date,
    // вік рахується з дати народження, якщо вона є -- це точніше за вік з джерела,
    // який міг застаріти з моменту генерації даних; age з джерела -- тільки fallback
    age: b_date !== null ? calculateAge(b_date) : toNumberOrNull(mapped.age),

    phone: normalizePhone(mapped.phone),
    picture_large: toStringOrNull(mapped.picture_large),
    picture_thumbnail: toStringOrNull(mapped.picture_thumbnail),

    note: normalizeNote(mapped.note),

    // не нормалізуються тут, переносяться як є для User (генерація fallback -- його робота)
    favorite: mapped.favorite ?? null,
    course: mapped.course ?? null,
    bg_color: mapped.bg_color ?? null,
  };
};

// Рахує ідентифікаційні ключі з уже нормалізованого об'єкта (результату
// normalizeUserFields). Єдине джерело правди для того, що вважається "тим самим
// юзером" -- використовується і для дедуплікації до створення User, і (через User)
// після.
const buildIdentityKeys = (normalized) => {
  const keys = [];

  if (normalized.full_name !== null && normalized.b_date !== null) {
    keys.push(`name:${normalized.full_name.toLowerCase()}|${normalized.b_date}`);
  }
  if (normalized.email !== null) {
    keys.push(`email:${normalized.email}`);
  }
  if (normalized.phone !== null) {
    keys.push(`phone:${normalized.phone}`);
  }
  if (normalized.full_name !== null && normalized.picture_large !== null) {
    keys.push(`name:${normalized.full_name.toLowerCase()}|photo:${normalized.picture_large}`);
  }

  return keys;
};

export { normalizeUserFields, buildIdentityKeys, isBlank };

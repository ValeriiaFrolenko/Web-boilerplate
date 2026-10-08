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
  return date.toISOString();
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

// Спільна фінальна збірка полів з будь-якого джерела в єдиний нормалізований вигляд.
const finalizeNormalized = (fields) => {
  const b_date = normalizeDate(fields.b_date);

  return {
    gender: capitalizeFirst(fields.gender),
    title: toStringOrNull(fields.title),
    full_name: normalizeFullName(fields.full_name),
    city: toStringOrNull(fields.city),
    state: toStringOrNull(fields.state),
    country: toStringOrNull(fields.country),
    postcode: toStringOrNull(fields.postcode),

    latitude: toNumberOrNull(fields.latitude),
    longitude: toNumberOrNull(fields.longitude),

    tz_offset: toStringOrNull(fields.tz_offset),
    tz_description: toStringOrNull(fields.tz_description),

    email: normalizeEmail(fields.email),
    b_date,
    // вік рахується з дати народження, якщо вона є -- це точніше за вік з джерела,
    // який міг застаріти з моменту генерації даних; age з джерела -- тільки fallback
    age: b_date !== null ? calculateAge(b_date) : toNumberOrNull(fields.age),

    phone: normalizePhone(fields.phone),
    picture_large: toStringOrNull(fields.picture_large),
    picture_thumbnail: toStringOrNull(fields.picture_thumbnail),

    note: normalizeNote(fields.note),

    // не нормалізуються тут -- генерація fallback для них це робота User
    favorite: fields.favorite ?? null,
    course: fields.course ?? null,
    bg_color: fields.bg_color ?? null,
  };
};

// Дістає поля з randomUserMock (вкладена структура name/location/dob/picture) і нормалізує.
const normalizeFromRandomUserMock = (raw) => finalizeNormalized({
  gender: raw.gender,
  title: raw.name?.title,
  full_name: raw.name ? `${raw.name.first ?? ''} ${raw.name.last ?? ''}`.trim() : null,

  city: raw.location?.city,
  state: raw.location?.state,
  country: raw.location?.country,
  postcode: raw.location?.postcode,

  latitude: raw.location?.coordinates?.latitude,
  longitude: raw.location?.coordinates?.longitude,

  tz_offset: raw.location?.timezone?.offset,
  tz_description: raw.location?.timezone?.description,

  email: raw.email,
  b_date: raw.dob?.date,
  age: raw.dob?.age,
  phone: raw.phone,

  picture_large: raw.picture?.large,
  picture_thumbnail: raw.picture?.thumbnail,
});

// Дістає поля з одного об'єкта additionalUsers (плоска структура) і одразу нормалізує.
const normalizeFromAdditionalUsers = (raw) => finalizeNormalized({
  gender: raw.gender,
  title: raw.title,
  full_name: raw.full_name,

  city: raw.city,
  state: raw.state,
  country: raw.country,
  postcode: raw.postcode,

  latitude: raw.coordinates?.latitude,
  longitude: raw.coordinates?.longitude,

  tz_offset: raw.timezone?.offset,
  tz_description: raw.timezone?.description,

  email: raw.email,
  b_date: raw.b_day,
  age: raw.age,
  phone: raw.phone,

  picture_large: raw.picture_large,
  picture_thumbnail: raw.picture_thumbnail,

  favorite: raw.favorite,
  course: raw.course,
  bg_color: raw.bg_color,
  note: raw.note,
});

// Рахує ідентифікаційні ключі з нормалізованого об'єкта.
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

export { normalizeFromRandomUserMock, normalizeFromAdditionalUsers, buildIdentityKeys, isBlank };
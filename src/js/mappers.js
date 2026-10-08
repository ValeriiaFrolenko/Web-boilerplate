// Зводить один об'єкт з randomUserMock до стандартного плоского набору ключів,
const mapRandomUserMockUser = (raw) => ({
  gender: raw.gender ?? null,
  title: raw.name?.title ?? null,
  full_name: raw.name
    ? `${raw.name.first ?? ''} ${raw.name.last ?? ''}`.trim()
    : null,

  city: raw.location?.city ?? null,
  state: raw.location?.state ?? null,
  country: raw.location?.country ?? null,
  postcode: raw.location?.postcode ?? null,

  latitude: raw.location?.coordinates?.latitude ?? null,
  longitude: raw.location?.coordinates?.longitude ?? null,

  tz_offset: raw.location?.timezone?.offset ?? null,
  tz_description: raw.location?.timezone?.description ?? null,

  email: raw.email ?? null,
  b_date: raw.dob?.date ?? null,
  age: raw.dob?.age ?? null,
  phone: raw.phone ?? null,

  picture_large: raw.picture?.large ?? null,
  picture_thumbnail: raw.picture?.thumbnail ?? null,
});

// Зводить один об'єкт з additionalUsers до того самого стандартного набору ключів.
const mapAdditionalUser = (raw) => ({
  gender: raw.gender ?? null,
  title: raw.title ?? null,
  full_name: raw.full_name ?? null,

  city: raw.city ?? null,
  state: raw.state ?? null,
  country: raw.country ?? null,
  postcode: raw.postcode ?? null,

  latitude: raw.coordinates?.latitude ?? null,
  longitude: raw.coordinates?.longitude ?? null,

  tz_offset: raw.timezone?.offset ?? null,
  tz_description: raw.timezone?.description ?? null,

  email: raw.email ?? null,
  b_date: raw.b_day ?? null,
  age: raw.age ?? null,
  phone: raw.phone ?? null,

  picture_large: raw.picture_large ?? null,
  picture_thumbnail: raw.picture_thumbnail ?? null,

  favorite: raw.favorite ?? null,
  course: raw.course ?? null,
  bg_color: raw.bg_color ?? null,
  note: raw.note ?? null,
});

export { mapRandomUserMockUser, mapAdditionalUser };
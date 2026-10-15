import type { User } from '../logic/types';

interface TeacherDetailsModalProps {
  user: User;
  onClose: () => void;
}

const formatDate = (iso: string | null): string => {
  if (iso === null) return '—';
  return new Date(iso).toLocaleDateString('uk-UA');
};

const TeacherDetailsModal = ({ user, onClose }: TeacherDetailsModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose}>
          ×
        </button>

        <img src={user.pictureLarge ?? undefined} alt={user.fullName ?? ''} className="modal__photo" />

        <h2>{user.fullName ?? 'Без імені'}</h2>
        <p className="modal__course">{user.course}</p>

        <dl className="modal__details">
          <dt>Стать</dt>
          <dd>{user.gender ?? '—'}</dd>

          <dt>Вік</dt>
          <dd>{user.age ?? '—'}</dd>

          <dt>Дата народження</dt>
          <dd>{formatDate(user.birthDate)}</dd>

          <dt>Країна</dt>
          <dd>{user.country ?? '—'}</dd>

          <dt>Місто</dt>
          <dd>{user.city ?? '—'}</dd>

          <dt>Email</dt>
          <dd>{user.email ?? '—'}</dd>

          <dt>Телефон</dt>
          <dd>{user.phone ?? '—'}</dd>

          <dt>Коментар</dt>
          <dd>{user.note || '—'}</dd>
        </dl>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;

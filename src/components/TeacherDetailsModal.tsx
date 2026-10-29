import type { User } from '../logic/types';

interface TeacherDetailsModalProps {
    user: User;
    onClose: () => void;
    onToggleFavorite: (userId: string) => void;
}

const TeacherDetailsModal = ({ user, onClose, onToggleFavorite }: TeacherDetailsModalProps) => {
    const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) onClose();
    };

    const location = [user.city, user.country].filter((v): v is string => v !== null).join(', ');
    const ageGender = [
        user.age !== null ? String(user.age) : null,
        user.gender,
    ].filter((v): v is string => v !== null && v !== '').join(', ');

    return (
        <div className="modal" onMouseDown={handleOverlayMouseDown}>
            <div className="modal__window">
                <div className="modal__header">
                    <h2 className="modal__title">Teacher Info</h2>
                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="modal__body teacher">
                    <button
                        type="button"
                        className={`teacher__star ${user.favorite ? 'teacher__star--active' : ''}`}
                        onClick={() => onToggleFavorite(user.id)}
                        aria-label={user.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    />

                    {user.pictureLarge !== null && (
                        <img
                            className="teacher__photo"
                            src={user.pictureLarge}
                            alt={user.fullName}
                            width={325}
                            height={319}
                        />
                    )}

                    <h3 className="teacher__name">{user.fullName}</h3>
                    <p className="teacher__speciality">{user.course}</p>

                    <ul className="teacher__facts">
                        {location !== '' && <li>{location}</li>}
                        {ageGender !== '' && <li>{ageGender}</li>}
                        {user.email !== null && (
                            <li>
                                <a href={`mailto:${user.email}`}>{user.email}</a>
                            </li>
                        )}
                        {user.phone !== null && (
                            <li>
                                <a href={`tel:${user.phone}`}>{user.phone}</a>
                            </li>
                        )}
                    </ul>

                    {user.note !== '' && <p className="teacher__notes">{user.note}</p>}
                </div>
            </div>
        </div>
    );
};

export default TeacherDetailsModal;

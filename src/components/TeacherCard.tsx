import { memo } from 'react';
import type { User } from '../logic/types';

interface TeacherCardProps {
    user: User;
}

const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).filter((p) => p.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts
        .map((p) => p.charAt(0).toUpperCase())
        .join('.');
};

const TeacherCard = memo(({ user }: TeacherCardProps) => {
    return (
        <li className="card">
            <a className="card__link" href="#!" data-user-id={user.id}>
                {user.pictureLarge !== null ? (
                    <img
                        className="card__avatar"
                        src={user.pictureLarge}
                        alt={user.fullName}
                        width={150}
                        height={150}
                    />
                ) : (
                    <span className="card__avatar card__avatar--initials">
                        {getInitials(user.fullName)}
                    </span>
                )}
                {user.favorite && <span className="card__star" aria-hidden="true" />}
                <span className="card__name">{user.fullName}</span>
                <span className="card__speciality">{user.course}</span>
                <span className="card__country">{user.country}</span>
            </a>
        </li>
    );
});

TeacherCard.displayName = 'TeacherCard';

export default TeacherCard;

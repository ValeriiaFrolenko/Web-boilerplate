import { useCallback, useRef } from 'react';
import type { User } from '../logic/types';
import TeacherCard from './TeacherCard';

interface FavoritesSectionProps {
    users: User[];
    onSelectUser: (userId: string) => void;
}

const FavoritesSection = ({ users, onSelectUser }: FavoritesSectionProps) => {
    const scrollerRef = useRef<HTMLUListElement | null>(null);

    const favorites = users.filter((u) => u.favorite);

    const handleListClick = useCallback((e: React.MouseEvent<HTMLUListElement>): void => {
        const link = (e.target as HTMLElement).closest('a[data-user-id]');
        if (link === null) return;
        e.preventDefault();
        const userId = link.getAttribute('data-user-id');
        if (userId !== null) onSelectUser(userId);
    }, [onSelectUser]);

    const scrollPrev = useCallback((): void => {
        const el = scrollerRef.current;
        if (el === null) return;
        el.scrollBy({ left: -400, behavior: 'smooth' });
    }, []);

    const scrollNext = useCallback((): void => {
        const el = scrollerRef.current;
        if (el === null) return;
        el.scrollBy({ left: 400, behavior: 'smooth' });
    }, []);

    return (
        <section className="section section--favorites" id="favorites">
            <h2 className="section__title">Favorites</h2>

            {favorites.length === 0 ? (
                <p className="cards__empty">No favorites yet.</p>
            ) : (
                <div className="slider">
                    <button
                        type="button"
                        className="slider__arrow slider__arrow--prev"
                        onClick={scrollPrev}
                        aria-label="Previous"
                    />

                    <ul className="cards cards--slider" ref={scrollerRef} onClick={handleListClick}>
                        {favorites.map((user) => (
                            <TeacherCard key={user.id} user={user} />
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="slider__arrow slider__arrow--next"
                        onClick={scrollNext}
                        aria-label="Next"
                    />
                </div>
            )}
        </section>
    );
};

export default FavoritesSection;

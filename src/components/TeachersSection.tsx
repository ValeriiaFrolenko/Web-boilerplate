import { useCallback, useState } from 'react';
import type { FilterCriteria, User } from '../logic/types';
import FilterPanel from './FilterPanel';
import TeacherCard from './TeacherCard';

const INITIAL_VISIBLE = 10;

interface TeachersSectionProps {
    filters: FilterCriteria;
    onFiltersChange: (filters: FilterCriteria) => void;
    users: User[];
    countries: string[];
    onSelectUser: (userId: string) => void;
}

const TeachersSection = ({
                             filters,
                             onFiltersChange,
                             users,
                             countries,
                             onSelectUser,
                         }: TeachersSectionProps) => {
    const [expanded, setExpanded] = useState(false);

    const handleListClick = useCallback((e: React.MouseEvent<HTMLUListElement>): void => {
        const link = (e.target as HTMLElement).closest('a[data-user-id]');
        if (link === null) return;
        e.preventDefault();
        const userId = link.getAttribute('data-user-id');
        if (userId !== null) onSelectUser(userId);
    }, [onSelectUser]);

    const handleToggle = useCallback((): void => {
        setExpanded((prev) => !prev);
    }, []);

    const displayed = expanded ? users : users.slice(0, INITIAL_VISIBLE);
    const canExpand = users.length > INITIAL_VISIBLE;

    return (
        <section className="section section--teachers" id="teachers">
            <div className="wrap">
                <h1 className="section__title">Top Teachers</h1>

                <FilterPanel
                    filters={filters}
                    countries={countries}
                    onChange={onFiltersChange}
                />

                {users.length === 0 ? (
                    <p className="cards__empty">No teachers match the current filters.</p>
                ) : (
                    <>
                        <ul className="cards" onClick={handleListClick}>
                            {displayed.map((user) => (
                                <TeacherCard key={user.id} user={user} />
                            ))}
                        </ul>

                        {canExpand && (
                            <p className="cards__more">
                                <button type="button" className="btn" onClick={handleToggle}>
                                    {expanded ? 'Show less' : `See all ${users.length}`}
                                </button>
                            </p>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default TeachersSection;
import type { User, SortField, SortDirection } from '../logic/types';
import StatisticsPanel from './StatisticsPanel';
import TeacherTable from './TeacherTable';
import Pagination from './Pagination';

interface StatisticsSectionProps {
    users: User[];
    visibleUsers: User[];
    pageUsers: User[];
    matchPercent: number | null;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    onSelectUser: (userId: string) => void;
    currentPage: number;
    pageCount: number;
    canPrev: boolean;
    isLoadingNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    onPageChange: (page: number) => void;
}

const StatisticsSection = ({
                               users,
                               visibleUsers,
                               pageUsers,
                               matchPercent,
                               sortField,
                               sortDirection,
                               onSort,
                               onSelectUser,
                               currentPage,
                               pageCount,
                               canPrev,
                               isLoadingNext,
                               onPrev,
                               onNext,
                               onPageChange,
                           }: StatisticsSectionProps) => {
    return (
        <section className="section section--stats" id="statistics">
            <div className="wrap">
                <h2 className="section__title">Statistics</h2>

                <StatisticsPanel
                    users={users}
                    visibleUsers={visibleUsers}
                    matchPercent={matchPercent}
                />

                <TeacherTable
                    users={pageUsers}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                    onSelectUser={onSelectUser}
                />

                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    canPrev={canPrev}
                    isLoadingNext={isLoadingNext}
                    onPrev={onPrev}
                    onNext={onNext}
                    onPageChange={onPageChange}
                />
            </div>
        </section>
    );
};

export default StatisticsSection;
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
    User,
    FilterCriteria,
    SortField,
    SortDirection,
    FindUserField,
    AgeOperator,
} from './logic/types';
import { normalizeFromRandomUserMock } from './logic/normalizeFromSource';
import { buildUser } from './logic/buildUser';
import filterUsers from './logic/filterUsers';
import sortUsers from './logic/sortUsers';
import findUser from './logic/findUser';
import { fetchRandomUsers, postTeacher } from './api/randomUserApi';

import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import StatisticsPanel from './components/StatisticsPanel';
import TeacherTable from './components/TeacherTable';
import TeacherDetailsModal from './components/TeacherDetailsModal';
import AddTeacherModal from './components/AddTeacherModal';
import Pagination from './components/Pagination';

const INITIAL_LOAD = 50;
const PAGE_SIZE = 10;

const normalizeBatch = (raw: Awaited<ReturnType<typeof fetchRandomUsers>>): User[] =>
    raw.map((entry) => buildUser(normalizeFromRandomUserMock(entry)));

const App = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const [filters, setFilters] = useState<FilterCriteria>({});
    const [sortField, setSortField] = useState<SortField>('fullName');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const [searchField, setSearchField] = useState<FindUserField>('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchAgeOperator, setSearchAgeOperator] = useState<AgeOperator>('=');

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);
            try {
                const raw = await fetchRandomUsers(INITIAL_LOAD);
                if (cancelled) return;
                setUsers(normalizeBatch(raw));
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : 'Failed to load users');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const visibleUsers = useMemo(() => {
        let result = filterUsers(users, filters);
        if (searchQuery.trim() !== '') {
            result = findUser(result, searchField, searchQuery, searchAgeOperator);
        }
        return sortUsers(result, sortField, sortDirection);
    }, [users, filters, sortField, sortDirection, searchField, searchQuery, searchAgeOperator]);

    const selectedUser = useMemo(
        () => users.find((user) => user.id === selectedUserId) ?? null,
        [users, selectedUserId],
    );

    const totalPages = Math.max(1, Math.ceil(visibleUsers.length / PAGE_SIZE));
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pageUsers = visibleUsers.slice(pageStart, pageStart + PAGE_SIZE);

    const resetPage = useCallback(() => setCurrentPage(1), []);

    const handleFiltersChange = (next: FilterCriteria): void => {
        setFilters(next);
        resetPage();
    };

    const handleSearchFieldChange = (next: FindUserField): void => {
        setSearchField(next);
        resetPage();
    };

    const handleSearchQueryChange = (next: string): void => {
        setSearchQuery(next);
        resetPage();
    };

    const handleSearchAgeOperatorChange = (next: AgeOperator): void => {
        setSearchAgeOperator(next);
        resetPage();
    };

    const handleSort = (field: SortField): void => {
        if (field === sortField) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        resetPage();
    };

    const handleToggleFavorite = (userId: string): void => {
        setUsers((prev) =>
            prev.map((user) => (user.id === userId ? { ...user, favorite: !user.favorite } : user)),
        );
    };

    const handleAddUser = async (newUser: User): Promise<void> => {
        const saved = await postTeacher(newUser);
        setUsers((prev) => [saved, ...prev]);
        resetPage();
        setAddModalOpen(false);
    };

    const handleNext = async (): Promise<void> => {
        if (isFetchingMore) return;

        const hasMoreVisible = pageStart + PAGE_SIZE < visibleUsers.length;
        if (hasMoreVisible) {
            setCurrentPage((p) => p + 1);
            return;
        }

        setIsFetchingMore(true);
        try {
            const raw = await fetchRandomUsers(PAGE_SIZE);
            setUsers((prev) => [...prev, ...normalizeBatch(raw)]);
            setCurrentPage((p) => p + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more users');
        } finally {
            setIsFetchingMore(false);
        }
    };

    const handlePrev = (): void => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    return (
        <div className="app">
            <header className="app__header">
                <h1>Пошук викладачів</h1>
                <button type="button" className="button button--primary" onClick={() => setAddModalOpen(true)}>
                    Додати викладача
                </button>
            </header>

            {error && (
                <div className="app__error">
                    <span>{error}</span>
                    {users.length === 0 && (
                        <button type="button" className="button" onClick={() => setReloadKey((k) => k + 1)}>
                            Спробувати ще раз
                        </button>
                    )}
                </div>
            )}

            {isLoading ? (
                <div className="app__status">Завантаження користувачів…</div>
            ) : (
                <>
                    <StatisticsPanel users={users} visibleUsers={visibleUsers} />

                    <div className="app__controls">
                        <FilterPanel filters={filters} onChange={handleFiltersChange} />
                        <SearchBar
                            field={searchField}
                            query={searchQuery}
                            ageOperator={searchAgeOperator}
                            onFieldChange={handleSearchFieldChange}
                            onQueryChange={handleSearchQueryChange}
                            onAgeOperatorChange={handleSearchAgeOperatorChange}
                        />
                    </div>

                    <TeacherTable
                        users={pageUsers}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onSelect={setSelectedUserId}
                        onToggleFavorite={handleToggleFavorite}
                    />

                    <Pagination
                        currentPage={currentPage}
                        pageCount={totalPages}
                        visibleCount={visibleUsers.length}
                        canPrev={currentPage > 1}
                        isLoadingNext={isFetchingMore}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </>
            )}

            {selectedUser && (
                <TeacherDetailsModal user={selectedUser} onClose={() => setSelectedUserId(null)} />
            )}

            {isAddModalOpen && (
                <AddTeacherModal onClose={() => setAddModalOpen(false)} onSubmit={handleAddUser} />
            )}
        </div>
    );
};

export default App;
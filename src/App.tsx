import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
    User,
    FilterCriteria,
    SortField,
    SortDirection,
    FindUserField,
    AgeOperator,
} from './logic/types';
import filterUsers from './logic/filterUsers';
import sortUsers from './logic/sortUsers';
import findUser from './logic/findUser';
import getMatchPercentage from './logic/getMatchPercentage';
import mergeUsers from './logic/mergeUsers';
import { fetchValidUsers, fetchSavedTeachers, postTeacher } from './api/randomUserApi';

import Header from './components/Header';
import Footer from './components/Footer';
import TeachersSection from './components/TeachersSection';
import StatisticsSection from './components/StatisticsSection';
import FavoritesSection from './components/FavoritesSection';
import AboutSection from './components/AboutSection';
import TeacherDetailsModal from './components/TeacherDetailsModal';
import AddTeacherModal from './components/AddTeacherModal';

const INITIAL_LOAD = 50;
const PAGE_SIZE = 10;

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
                const [savedUsers, apiUsers] = await Promise.all([
                    fetchSavedTeachers().catch((): User[] => []),
                    fetchValidUsers(INITIAL_LOAD),
                ]);
                if (cancelled) return;
                setUsers(mergeUsers(savedUsers, apiUsers));
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : 'Failed to load users');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void load();
        return () => { cancelled = true; };
    }, [reloadKey]);

    const visibleUsers = useMemo(() => {
        let result = filterUsers(users, filters);
        if (searchQuery.trim() !== '') {
            result = findUser(result, searchField, searchQuery, searchAgeOperator);
        }
        return sortUsers(result, sortField, sortDirection);
    }, [users, filters, sortField, sortDirection, searchField, searchQuery, searchAgeOperator]);

    const matchPercent = useMemo(() => {
        if (searchQuery.trim() === '') return null;
        return getMatchPercentage(users, searchField, searchQuery, searchAgeOperator);
    }, [users, searchField, searchQuery, searchAgeOperator]);

    const availableCountries = useMemo(() => {
        const set = new Set<string>();
        for (const u of users) {
            if (u.country !== '' && u.country !== 'Unknown') set.add(u.country);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [users]);

    const selectedUser = useMemo(
        () => users.find((user) => user.id === selectedUserId) ?? null,
        [users, selectedUserId],
    );

    const pageCount = Math.max(1, Math.ceil(visibleUsers.length / PAGE_SIZE));
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pageUsers = useMemo(
        () => visibleUsers.slice(pageStart, pageStart + PAGE_SIZE),
        [visibleUsers, pageStart],
    );

    const handleFiltersChange = useCallback((next: FilterCriteria): void => {
        setFilters(next);
        setCurrentPage(1);
    }, []);

    const handleSearchFieldChange = useCallback((next: FindUserField): void => {
        setSearchField(next);
        setCurrentPage(1);
    }, []);

    const handleSearchQueryChange = useCallback((next: string): void => {
        setSearchQuery(next);
        setCurrentPage(1);
    }, []);

    const handleSearchAgeOperatorChange = useCallback((next: AgeOperator): void => {
        setSearchAgeOperator(next);
        setCurrentPage(1);
    }, []);

    const handleSort = useCallback((field: SortField): void => {
        if (field === sortField) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    }, [sortField]);

    const handleToggleFavorite = useCallback((userId: string): void => {
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, favorite: !u.favorite } : u)),
        );
    }, []);

    const handleAddUser = useCallback(async (newUser: User): Promise<void> => {
        const saved = await postTeacher(newUser);
        setUsers((prev) => [saved, ...prev]);
        setCurrentPage(1);
        setAddModalOpen(false);
    }, []);

    const handleNext = useCallback(async (): Promise<void> => {
        if (isFetchingMore) return;

        if (pageStart + PAGE_SIZE < visibleUsers.length) {
            setCurrentPage((p) => p + 1);
            return;
        }

        setIsFetchingMore(true);
        try {
            const loaded = await fetchValidUsers(PAGE_SIZE);
            setUsers((prev) => [...prev, ...loaded]);
            setCurrentPage((p) => p + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more users');
        } finally {
            setIsFetchingMore(false);
        }
    }, [isFetchingMore, pageStart, visibleUsers.length]);

    const handlePrev = useCallback((): void => {
        setCurrentPage((p) => (p > 1 ? p - 1 : p));
    }, []);

    const handlePageChange = useCallback((page: number): void => {
        setCurrentPage(Math.max(1, Math.min(page, pageCount)));
    }, [pageCount]);

    const handleCloseDetails = useCallback((): void => {
        setSelectedUserId(null);
    }, []);

    const handleOpenAddModal = useCallback((): void => {
        setAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback((): void => {
        setAddModalOpen(false);
    }, []);

    return (
        <div className="sheet">
            <Header
                searchField={searchField}
                searchQuery={searchQuery}
                searchAgeOperator={searchAgeOperator}
                onSearchFieldChange={handleSearchFieldChange}
                onSearchQueryChange={handleSearchQueryChange}
                onSearchAgeOperatorChange={handleSearchAgeOperatorChange}
                onAddTeacherClick={handleOpenAddModal}
            />

            <div className="divider" />

            <main id="top">
                {error !== null && (
                    <div className="wrap">
                        <p className="cards__empty">
                            {error}
                            {users.length === 0 && (
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ marginLeft: 12 }}
                                    onClick={() => setReloadKey((k) => k + 1)}
                                >
                                    Retry
                                </button>
                            )}
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="wrap">
                        <p className="cards__empty">Loading teachers…</p>
                    </div>
                ) : (
                    <>
                        <TeachersSection
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            users={visibleUsers}
                            countries={availableCountries}
                            onSelectUser={setSelectedUserId}
                        />

                        <div className="divider" />

                        <StatisticsSection
                            users={users}
                            visibleUsers={visibleUsers}
                            pageUsers={pageUsers}
                            matchPercent={matchPercent}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                            onSelectUser={setSelectedUserId}
                            currentPage={currentPage}
                            pageCount={pageCount}
                            canPrev={currentPage > 1}
                            isLoadingNext={isFetchingMore}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            onPageChange={handlePageChange}
                        />

                        <div className="divider" />

                        <FavoritesSection users={users} onSelectUser={setSelectedUserId} />

                        <div className="divider" />

                        <AboutSection />
                    </>
                )}
            </main>

            <Footer onAddTeacherClick={handleOpenAddModal} />

            {selectedUser !== null && (
                <TeacherDetailsModal
                    user={selectedUser}
                    onClose={handleCloseDetails}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}

            {isAddModalOpen && (
                <AddTeacherModal
                    onClose={handleCloseAddModal}
                    onSubmit={handleAddUser}
                />
            )}
        </div>
    );
};

export default App;
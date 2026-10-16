import { useMemo, useState } from 'react';
import type { User, FilterCriteria, SortField, SortDirection, FindUserField, AgeOperator } from './logic/types';
import formatUsers from './logic/formatUsers';
import filterUsers from './logic/filterUsers';
import sortUsers from './logic/sortUsers';
import findUser from './logic/findUser';
import { randomUserMock, additionalUsers } from './data/FE4U-Lab2-mock';

import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import TeacherTable from './components/TeacherTable';
import TeacherDetailsModal from './components/TeacherDetailsModal';
import AddTeacherModal from './components/AddTeacherModal';

const App = () => {
    const [users, setUsers] = useState<User[]>(() => formatUsers(randomUserMock, additionalUsers));

    const [filters, setFilters] = useState<FilterCriteria>({});
    const [sortField, setSortField] = useState<SortField>('fullName');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const [searchField, setSearchField] = useState<FindUserField>('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchAgeOperator, setSearchAgeOperator] = useState<AgeOperator>('=');

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

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

    const handleSort = (field: SortField): void => {
        if (field === sortField) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleToggleFavorite = (userId: string): void => {
        setUsers((prev) =>
            prev.map((user) => (user.id === userId ? { ...user, favorite: !user.favorite } : user)),
        );
    };

    const handleAddUser = (newUser: User): void => {
        setUsers((prev) => [newUser, ...prev]);
        setAddModalOpen(false);
    };

    return (
        <div className="app">
            <header className="app__header">
                <h1>Пошук викладачів</h1>
                <button type="button" className="button button--primary" onClick={() => setAddModalOpen(true)}>
                    Додати викладача
                </button>
            </header>

            <div className="app__controls">
                <FilterPanel filters={filters} onChange={setFilters} />
                <SearchBar
                    field={searchField}
                    query={searchQuery}
                    ageOperator={searchAgeOperator}
                    onFieldChange={setSearchField}
                    onQueryChange={setSearchQuery}
                    onAgeOperatorChange={setSearchAgeOperator}
                />
            </div>

            <TeacherTable
                users={visibleUsers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSelect={setSelectedUserId}
                onToggleFavorite={handleToggleFavorite}
            />

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
import { memo } from 'react';
import type { User, SortField, SortDirection } from '../logic/types';

interface TeacherTableProps {
    users: User[];
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    onSelectUser: (userId: string) => void;
}

interface ColumnDef {
    field: SortField | null;
    label: string;
}

const COLUMNS: ColumnDef[] = [
    { field: 'fullName', label: 'Name' },
    { field: 'course', label: 'Specialty' },
    { field: 'age', label: 'Age' },
    { field: 'birthDate', label: 'Date of birth' },
    { field: null, label: 'Gender' },
    { field: 'country', label: 'Nationality' },
];

const formatDate = (iso: string | null): string => {
    if (iso === null) return '—';
    return new Date(iso).toLocaleDateString('uk-UA');
};

const TeacherTable = memo(({
                               users,
                               sortField,
                               sortDirection,
                               onSort,
                               onSelectUser,
                           }: TeacherTableProps) => {
    const handleBodyClick = (e: React.MouseEvent<HTMLTableSectionElement>): void => {
        const row = (e.target as HTMLElement).closest('tr[data-user-id]');
        if (row === null) return;
        const userId = row.getAttribute('data-user-id');
        if (userId !== null) onSelectUser(userId);
    };

    return (
        <table className="stats">
            <thead>
            <tr>
                {COLUMNS.map((column) => {
                    if (column.field === null) {
                        return <th key={column.label}>{column.label}</th>;
                    }
                    const field = column.field;
                    return (
                        <th
                            key={field}
                            className="stats__sortable"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onSort(field)}
                        >
                            {column.label}
                            {sortField === field && (
                                <span
                                    className="stats__arrow"
                                    style={{
                                        visibility: 'visible',
                                        transform: sortDirection === 'asc'
                                            ? 'rotate(45deg)'
                                            : 'rotate(-135deg)',
                                    }}
                                />
                            )}
                        </th>
                    );
                })}
            </tr>
            </thead>
            <tbody onClick={handleBodyClick}>
            {users.length === 0 && (
                <tr>
                    <td colSpan={COLUMNS.length} className="stats__empty">
                        Nothing found
                    </td>
                </tr>
            )}
            {users.map((user) => (
                <tr
                    key={user.id}
                    className="stats__row"
                    data-user-id={user.id}
                >
                    <td>{user.fullName}</td>
                    <td>{user.course}</td>
                    <td>{user.age ?? '—'}</td>
                    <td>{formatDate(user.birthDate)}</td>
                    <td>{user.gender ?? '—'}</td>
                    <td>{user.country}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
});

TeacherTable.displayName = 'TeacherTable';

export default TeacherTable;
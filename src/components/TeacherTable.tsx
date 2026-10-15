import type { User, SortField, SortDirection } from '../logic/types';

interface TeacherTableProps {
  users: User[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onSelect: (userId: string) => void;
  onToggleFavorite: (userId: string) => void;
}

interface ColumnDef {
  field: SortField;
  label: string;
}

const COLUMNS: ColumnDef[] = [
  { field: 'fullName', label: "Ім'я" },
  { field: 'course', label: 'Спеціальність' },
  { field: 'age', label: 'Вік' },
  { field: 'birthDate', label: 'Дата народження' },
  { field: 'country', label: 'Країна' },
];

const formatDate = (iso: string | null): string => {
  if (iso === null) return '—';
  return new Date(iso).toLocaleDateString('uk-UA');
};

const TeacherTable = ({
  users,
  sortField,
  sortDirection,
  onSort,
  onSelect,
  onToggleFavorite,
}: TeacherTableProps) => {
  return (
    <table className="teacher-table">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <th
              key={column.field}
              onClick={() => onSort(column.field)}
              className="teacher-table__sortable"
            >
              {column.label}
              {sortField === column.field && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
            </th>
          ))}
          <th>Обране</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan={COLUMNS.length + 1} className="teacher-table__empty">
              Нічого не знайдено
            </td>
          </tr>
        )}
        {users.map((user) => (
          <tr key={user.id} onClick={() => onSelect(user.id)} className="teacher-table__row">
            <td>{user.fullName ?? '—'}</td>
            <td>{user.course}</td>
            <td>{user.age ?? '—'}</td>
            <td>{formatDate(user.birthDate)}</td>
            <td>{user.country ?? '—'}</td>
            <td>
              <button
                type="button"
                className={`favorite-button ${user.favorite ? 'favorite-button--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(user.id);
                }}
              >
                {user.favorite ? '★' : '☆'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeacherTable;

import type { FindUserField, AgeOperator } from '../logic/types';

interface SearchBarProps {
    field: FindUserField;
    query: string;
    ageOperator: AgeOperator;
    onFieldChange: (field: FindUserField) => void;
    onQueryChange: (query: string) => void;
    onAgeOperatorChange: (operator: AgeOperator) => void;
}

const AGE_OPERATORS: AgeOperator[] = ['=', '>', '<', '>=', '<='];

const SearchBar = ({
                       field,
                       query,
                       ageOperator,
                       onFieldChange,
                       onQueryChange,
                       onAgeOperatorChange,
                   }: SearchBarProps) => {
    return (
        <div className="search-bar">
            <select value={field} onChange={(e) => onFieldChange(e.target.value as FindUserField)}>
                <option value="name">Ім'я</option>
                <option value="note">Коментар</option>
                <option value="age">Вік</option>
            </select>

            {field === 'age' && (
                <select value={ageOperator} onChange={(e) => onAgeOperatorChange(e.target.value as AgeOperator)}>
                    {AGE_OPERATORS.map((op) => (
                        <option key={op} value={op}>
                            {op}
                        </option>
                    ))}
                </select>
            )}

            <input
                type={field === 'age' ? 'number' : 'text'}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Пошук..."
            />
        </div>
    );
};

export default SearchBar;
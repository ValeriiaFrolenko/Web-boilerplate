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
        <div className="search">
            <select
                className="search__select"
                value={field}
                onChange={(e) => onFieldChange(e.target.value as FindUserField)}
            >
                <option value="name">Name</option>
                <option value="note">Note</option>
                <option value="age">Age</option>
            </select>

            {field === 'age' && (
                <select
                    className="search__select"
                    value={ageOperator}
                    onChange={(e) => onAgeOperatorChange(e.target.value as AgeOperator)}
                >
                    {AGE_OPERATORS.map((op) => (
                        <option key={op} value={op}>{op}</option>
                    ))}
                </select>
            )}

            <input
                className="search__input"
                type={field === 'age' ? 'number' : 'search'}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Name, note or age to search"
            />
        </div>
    );
};

export default SearchBar;

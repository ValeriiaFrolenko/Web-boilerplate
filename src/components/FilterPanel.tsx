import type { FilterCriteria } from '../logic/types';

interface FilterPanelProps {
    filters: FilterCriteria;
    countries: string[];
    onChange: (filters: FilterCriteria) => void;
}

const FilterPanel = ({ filters, countries, onChange }: FilterPanelProps) => {
    const updateCountry = (value: string): void => {
        const next = { ...filters };
        if (value === '') {
            delete next.country;
        } else {
            next.country = value;
        }
        onChange(next);
    };

    const updateGender = (value: string): void => {
        const next = { ...filters };
        if (value === '') {
            delete next.gender;
        } else {
            next.gender = value;
        }
        onChange(next);
    };

    const updateAge = (bound: 'min' | 'max', value: string): void => {
        const nextAge: { min?: number; max?: number } = { ...filters.age };

        if (value === '') {
            if (bound === 'min') {
                delete nextAge.min;
            } else {
                delete nextAge.max;
            }
        } else if (bound === 'min') {
            nextAge.min = Number(value);
        } else {
            nextAge.max = Number(value);
        }

        const next = { ...filters };
        if (Object.keys(nextAge).length === 0) {
            delete next.age;
        } else {
            next.age = nextAge;
        }

        onChange(next);
    };

    const updateFavorite = (checked: boolean): void => {
        const next = { ...filters };
        if (checked) {
            next.favorite = true;
        } else {
            delete next.favorite;
        }
        onChange(next);
    };

    const updateHasPhoto = (checked: boolean): void => {
        const next = { ...filters };
        if (checked) {
            next.hasPhoto = true;
        } else {
            delete next.hasPhoto;
        }
        onChange(next);
    };

    const handleClear = (): void => {
        onChange({});
    };

    const hasActiveFilters =
        filters.country !== undefined ||
        filters.age !== undefined ||
        filters.gender !== undefined ||
        filters.favorite !== undefined ||
        filters.hasPhoto !== undefined;

    const options = filters.country !== undefined && !countries.includes(filters.country)
        ? [...countries, filters.country].sort((a, b) => a.localeCompare(b))
        : countries;

    return (
        <form className="filters" onSubmit={(e) => e.preventDefault()}>
            <div className="filters__group">
                <label className="filters__label" htmlFor="filter-country">Country</label>
                <select
                    className="filters__select"
                    id="filter-country"
                    value={filters.country ?? ''}
                    onChange={(e) => updateCountry(e.target.value)}
                >
                    <option value="">Any</option>
                    {options.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="filters__group">
                <label className="filters__label" htmlFor="filter-age-min">Age</label>
                <input
                    className="filters__select"
                    id="filter-age-min"
                    type="number"
                    min={0}
                    max={150}
                    placeholder="from"
                    value={filters.age?.min ?? ''}
                    onChange={(e) => updateAge('min', e.target.value)}
                />
                <span>–</span>
                <input
                    className="filters__select"
                    type="number"
                    min={0}
                    max={150}
                    placeholder="to"
                    value={filters.age?.max ?? ''}
                    onChange={(e) => updateAge('max', e.target.value)}
                />
            </div>

            <div className="filters__group">
                <label className="filters__label" htmlFor="filter-gender">Gender</label>
                <select
                    className="filters__select"
                    id="filter-gender"
                    value={filters.gender ?? ''}
                    onChange={(e) => updateGender(e.target.value)}
                >
                    <option value="">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div className="filters__group">
                <label className="filters__check">
                    <input
                        type="checkbox"
                        checked={filters.hasPhoto === true}
                        onChange={(e) => updateHasPhoto(e.target.checked)}
                    />
                    Only with photo
                </label>
            </div>

            <div className="filters__group">
                <label className="filters__check filters__check--strong">
                    <input
                        type="checkbox"
                        checked={filters.favorite === true}
                        onChange={(e) => updateFavorite(e.target.checked)}
                    />
                    Only favorites
                </label>
            </div>

            {hasActiveFilters && (
                <button
                    type="button"
                    className="filters__clear"
                    onClick={handleClear}
                >
                    × Clear filters
                </button>
            )}
        </form>
    );
};

export default FilterPanel;
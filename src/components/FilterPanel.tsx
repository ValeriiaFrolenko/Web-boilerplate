import type { FilterCriteria } from '../logic/types';

interface FilterPanelProps {
    filters: FilterCriteria;
    onChange: (filters: FilterCriteria) => void;
}

const FilterPanel = ({ filters, onChange }: FilterPanelProps) => {
    const updateCountry = (value: string): void => {
        const next = { ...filters };
        if (value.trim() === '') {
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

        if (value.trim() === '') {
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

    const updateFavorite = (value: string): void => {
        const next = { ...filters };
        if (value === 'all') {
            delete next.favorite;
        } else {
            next.favorite = value === 'yes';
        }
        onChange(next);
    };

    return (
        <div className="filter-panel">
            <label className="filter-panel__field">
                Країна
                <input
                    type="text"
                    value={filters.country ?? ''}
                    onChange={(e) => updateCountry(e.target.value)}
                    placeholder="Будь-яка"
                />
            </label>

            <label className="filter-panel__field">
                Стать
                <select value={filters.gender ?? ''} onChange={(e) => updateGender(e.target.value)}>
                    <option value="">Будь-яка</option>
                    <option value="male">Чоловіча</option>
                    <option value="female">Жіноча</option>
                </select>
            </label>

            <label className="filter-panel__field">
                Вік від
                <input
                    type="number"
                    value={filters.age?.min ?? ''}
                    onChange={(e) => updateAge('min', e.target.value)}
                />
            </label>

            <label className="filter-panel__field">
                Вік до
                <input
                    type="number"
                    value={filters.age?.max ?? ''}
                    onChange={(e) => updateAge('max', e.target.value)}
                />
            </label>

            <label className="filter-panel__field">
                Обрані
                <select
                    value={filters.favorite === undefined ? 'all' : filters.favorite ? 'yes' : 'no'}
                    onChange={(e) => updateFavorite(e.target.value)}
                >
                    <option value="all">Всі</option>
                    <option value="yes">Тільки обрані</option>
                    <option value="no">Тільки необрані</option>
                </select>
            </label>
        </div>
    );
};

export default FilterPanel;
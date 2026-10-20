import type { User } from '../logic/types';

interface StatisticsPanelProps {
    users: User[];
    visibleUsers: User[];
}

const StatisticsPanel = ({ users, visibleUsers }: StatisticsPanelProps) => {
    const favorites = visibleUsers.filter((u) => u.favorite).length;
    const maleCount = visibleUsers.filter((u) => u.gender?.toLowerCase() === 'male').length;
    const femaleCount = visibleUsers.filter((u) => u.gender?.toLowerCase() === 'female').length;
    const uniqueCountries = new Set(
        visibleUsers.map((u) => u.country).filter((c) => c !== '' && c !== 'Unknown'),
    ).size;

    return (
        <div className="statistics-panel">
            <div className="statistics-panel__item">
                <span className="statistics-panel__value">{users.length}</span>
                <span className="statistics-panel__label">Всього завантажено</span>
            </div>
            <div className="statistics-panel__item">
                <span className="statistics-panel__value">{visibleUsers.length}</span>
                <span className="statistics-panel__label">Видимих зараз</span>
            </div>
            <div className="statistics-panel__item">
                <span className="statistics-panel__value">{favorites}</span>
                <span className="statistics-panel__label">Обраних</span>
            </div>
            <div className="statistics-panel__item">
        <span className="statistics-panel__value">
          {maleCount} / {femaleCount}
        </span>
                <span className="statistics-panel__label">Ч / Ж</span>
            </div>
            <div className="statistics-panel__item">
                <span className="statistics-panel__value">{uniqueCountries}</span>
                <span className="statistics-panel__label">Унікальних країн</span>
            </div>
        </div>
    );
};

export default StatisticsPanel;
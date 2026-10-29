import { memo } from 'react';
import type { User } from '../logic/types';

interface StatisticsPanelProps {
    users: User[];
    visibleUsers: User[];
    matchPercent: number | null;
}

const StatisticsPanel = memo(({ users, visibleUsers, matchPercent }: StatisticsPanelProps) => {
    const favorites = visibleUsers.filter((u) => u.favorite).length;
    const maleCount = visibleUsers.filter((u) => u.gender?.toLowerCase() === 'male').length;
    const femaleCount = visibleUsers.filter((u) => u.gender?.toLowerCase() === 'female').length;
    const uniqueCountries = new Set(
        visibleUsers.map((u) => u.country).filter((c) => c !== '' && c !== 'Unknown'),
    ).size;

    return (
        <div className="stats-panel">
            <div className="stats-panel__item">
                <span className="stats-panel__value">{users.length}</span>
                <span className="stats-panel__label">Loaded</span>
            </div>
            <div className="stats-panel__item">
                <span className="stats-panel__value">{visibleUsers.length}</span>
                <span className="stats-panel__label">Visible</span>
            </div>
            <div className="stats-panel__item">
                <span className="stats-panel__value">{favorites}</span>
                <span className="stats-panel__label">Favorites</span>
            </div>
            <div className="stats-panel__item">
                <span className="stats-panel__value">{maleCount} / {femaleCount}</span>
                <span className="stats-panel__label">M / F</span>
            </div>
            <div className="stats-panel__item">
                <span className="stats-panel__value">{uniqueCountries}</span>
                <span className="stats-panel__label">Countries</span>
            </div>
            <div className="stats-panel__item">
                <span className="stats-panel__value">
                    {matchPercent === null ? '—' : `${Math.round(matchPercent)}%`}
                </span>
                <span className="stats-panel__label">Match</span>
            </div>
        </div>
    );
});

StatisticsPanel.displayName = 'StatisticsPanel';

export default StatisticsPanel;

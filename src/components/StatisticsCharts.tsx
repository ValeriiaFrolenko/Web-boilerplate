import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { User } from '../logic/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatisticsChartsProps {
    users: User[];
}

const StatisticsCharts = ({ users }: StatisticsChartsProps) => {
    const genderData = useMemo(() => {
        const male = users.filter((u) => u.gender?.toLowerCase() === 'male').length;
        const female = users.filter((u) => u.gender?.toLowerCase() === 'female').length;
        return {
            labels: ['Male', 'Female'],
            datasets: [
                {
                    data: [male, female],
                    backgroundColor: ['#f75c48', '#129a9d'],
                },
            ],
        };
    }, [users]);

    const countryData = useMemo(() => {
        const counts = new Map<string, number>();
        users.forEach((u) => {
            if (u.country !== '' && u.country !== 'Unknown') {
                counts.set(u.country, (counts.get(u.country) ?? 0) + 1);
            }
        });
        const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return {
            labels: sorted.map(([name]) => name),
            datasets: [
                {
                    data: sorted.map(([, count]) => count),
                    backgroundColor: ['#f75c48', '#129a9d', '#464648', '#ecec02', '#767676'],
                },
            ],
        };
    }, [users]);

    return (
        <div className="stats-charts">
            <div className="stats-charts__item">
                <h3 className="stats-charts__title">By gender</h3>
                <div className="stats-charts__canvas">
                    <Pie data={genderData} />
                </div>
            </div>
            <div className="stats-charts__item">
                <h3 className="stats-charts__title">Top 5 countries</h3>
                <div className="stats-charts__canvas">
                    <Pie data={countryData} />
                </div>
            </div>
        </div>
    );
};

export default StatisticsCharts;
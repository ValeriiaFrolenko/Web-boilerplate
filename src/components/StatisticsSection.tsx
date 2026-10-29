import type { User } from '../logic/types';
import Pagination from './Pagination';
import StatisticsCharts from './StatisticsCharts';
import CountryReport from './CountryReport';

interface StatisticsSectionProps {
    users: User[];
    isLoadingNext: boolean;
    onNext: () => void;
}

const StatisticsSection = ({
                               users,
                               isLoadingNext,
                               onNext,
                           }: StatisticsSectionProps) => {
    return (
        <section className="section section--stats" id="statistics">
            <div className="wrap">
                <h2 className="section__title">Statistics</h2>

                <StatisticsCharts users={users} />

                <CountryReport users={users} />

                <Pagination
                    isLoadingNext={isLoadingNext}
                    onNext={onNext}
                />
            </div>
        </section>
    );
};

export default StatisticsSection;
import { memo } from 'react';
import SearchBar from './SearchBar';
import type { FindUserField, AgeOperator } from '../logic/types';

interface HeaderProps {
    searchField: FindUserField;
    searchQuery: string;
    searchAgeOperator: AgeOperator;
    onSearchFieldChange: (field: FindUserField) => void;
    onSearchQueryChange: (query: string) => void;
    onSearchAgeOperatorChange: (operator: AgeOperator) => void;
    onAddTeacherClick: () => void;
}

const Header = memo(({
    searchField,
    searchQuery,
    searchAgeOperator,
    onSearchFieldChange,
    onSearchQueryChange,
    onSearchAgeOperatorChange,
    onAddTeacherClick,
}: HeaderProps) => {
    return (
        <header className="header">
            <div className="wrap">
                <div className="header__top">
                    <a className="logo" href="#top">
                        <span className="logo__text" data-text="Teacherinder">Teacherinder</span>
                    </a>

                    <SearchBar
                        field={searchField}
                        query={searchQuery}
                        ageOperator={searchAgeOperator}
                        onFieldChange={onSearchFieldChange}
                        onQueryChange={onSearchQueryChange}
                        onAgeOperatorChange={onSearchAgeOperatorChange}
                    />
                </div>

                <div className="header__nav">
                    <nav className="nav">
                        <a className="nav__link" href="#teachers">Teachers</a>
                        <a className="nav__link" href="#statistics">Statistics</a>
                        <a className="nav__link" href="#favorites">Favorites</a>
                        <a className="nav__link" href="#about">About</a>
                    </nav>
                    <button type="button" className="btn btn--wide" onClick={onAddTeacherClick}>
                        Add teacher
                    </button>
                </div>
            </div>
        </header>
    );
});

Header.displayName = 'Header';

export default Header;

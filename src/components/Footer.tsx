import { memo } from 'react';

interface FooterProps {
    onAddTeacherClick: () => void;
}

const Footer = memo(({ onAddTeacherClick }: FooterProps) => {
    return (
        <footer className="footer">
            <div className="wrap footer__inner">
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
        </footer>
    );
});

Footer.displayName = 'Footer';

export default Footer;

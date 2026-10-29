import { memo } from 'react';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    canPrev: boolean;
    isLoadingNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    onPageChange: (page: number) => void;
}

const getPagesToShow = (currentPage: number, pageCount: number): number[] => {
    if (pageCount <= 3) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
        return [1, 2, 3];
    }
    if (currentPage >= pageCount - 1) {
        return [pageCount - 2, pageCount - 1, pageCount];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
};

const Pagination = memo(({
    currentPage,
    pageCount,
    canPrev,
    isLoadingNext,
    onPrev,
    onNext,
    onPageChange,
}: PaginationProps) => {
    const pagesToShow = getPagesToShow(currentPage, pageCount);
    const showLast = pageCount > 3 && !pagesToShow.includes(pageCount);

    return (
        <nav className="pagination">
            <button
                type="button"
                className="pagination__link"
                onClick={onPrev}
                disabled={!canPrev || isLoadingNext}
                aria-label="Previous page"
            >
                ←
            </button>

            {pagesToShow.map((page) => (
                <button
                    key={page}
                    type="button"
                    className={`pagination__link ${page === currentPage ? 'pagination__link--active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {showLast && (
                <>
                    <span className="pagination__dots">…</span>
                    <button
                        type="button"
                        className={`pagination__link ${currentPage === pageCount ? 'pagination__link--active' : ''}`}
                        onClick={() => onPageChange(pageCount)}
                    >
                        Last
                    </button>
                </>
            )}

            <button
                type="button"
                className="btn pagination__next"
                onClick={onNext}
                disabled={isLoadingNext}
            >
                {isLoadingNext ? 'Loading…' : 'Next'}
            </button>
        </nav>
    );
});

Pagination.displayName = 'Pagination';

export default Pagination;

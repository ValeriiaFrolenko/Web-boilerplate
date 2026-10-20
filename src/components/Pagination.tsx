interface PaginationProps {
    currentPage: number;
    pageCount: number;
    visibleCount: number;
    canPrev: boolean;
    isLoadingNext: boolean;
    onPrev: () => void;
    onNext: () => void;
}

const Pagination = ({
                        currentPage,
                        pageCount,
                        visibleCount,
                        canPrev,
                        isLoadingNext,
                        onPrev,
                        onNext,
                    }: PaginationProps) => {
    return (
        <div className="pagination">
            <button
                type="button"
                className="button"
                disabled={!canPrev || isLoadingNext}
                onClick={onPrev}
            >
                Назад
            </button>
            <span className="pagination__info">
        Сторінка {currentPage} з {pageCount} · показано {visibleCount}
      </span>
            <button
                type="button"
                className="button button--primary"
                disabled={isLoadingNext}
                onClick={onNext}
            >
                {isLoadingNext ? 'Завантаження…' : 'Далі'}
            </button>
        </div>
    );
};

export default Pagination;
interface PaginationProps {
    isLoadingNext: boolean;
    onNext: () => void;
}

const Pagination = ({ isLoadingNext, onNext }: PaginationProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
            <button
                type="button"
                className="btn btn--primary"
                onClick={onNext}
                disabled={isLoadingNext}
            >
                {isLoadingNext ? 'Loading…' : 'Load more teachers'}
            </button>
        </div>
    );
};

export default Pagination;
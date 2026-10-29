import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '../logic/types';

import wdrCss from '@webdatarocks/webdatarocks/webdatarocks.min.css?url';
import wdrToolbarJs from '@webdatarocks/webdatarocks/webdatarocks.toolbar.min.js?url';
import wdrJs from '@webdatarocks/webdatarocks/webdatarocks.js?url';

interface CountryReportProps {
    users: User[];
}

const CountryReport = ({ users }: CountryReportProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'country' | 'flat'>('country');

    const data = useMemo(() => {
        return users.map((u) => ({
            'Full Name': u.fullName,
            'Country': u.country,
            'Age': u.age ?? 0,
            'Gender': u.gender ?? '',
            'Specialty': u.course,
        }));
    }, [users]);

    useEffect(() => {
        const init = async (): Promise<void> => {
            if (!document.getElementById('wdr-css')) {
                const link = document.createElement('link');
                link.id = 'wdr-css';
                link.rel = 'stylesheet';
                link.href = wdrCss;
                document.head.appendChild(link);
            }

            const loadScript = (src: string, id: string): Promise<void> => {
                return new Promise((resolve, reject) => {
                    if (document.getElementById(id)) {
                        resolve();
                        return;
                    }
                    const script = document.createElement('script');
                    script.id = id;
                    script.src = src;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error(`Failed to load ${id}`));
                    document.body.appendChild(script);
                });
            };

            try {
                await loadScript(wdrToolbarJs, 'wdr-toolbar-js');
                await loadScript(wdrJs, 'wdr-js');

                setTimeout(() => {
                    if ((window as unknown as { WebDataRocks?: unknown }).WebDataRocks) {
                        setIsLoaded(true);
                    } else {
                        setErrorMsg('WebDataRocks library loaded but global not found');
                    }
                }, 100);
            } catch (err) {
                setErrorMsg(err instanceof Error ? err.message : 'Failed to load WebDataRocks');
            }
        };

        void init();
    }, []);

    useEffect(() => {
        if (!isLoaded || containerRef.current === null) return;

        const container = containerRef.current;
        container.innerHTML = '';

        try {
            const WDR = (window as unknown as { WebDataRocks: new (config: unknown) => { dispose: () => void } }).WebDataRocks;
            if (typeof WDR !== 'function') {
                setErrorMsg('WebDataRocks is not a constructor');
                return;
            }

            const isFlat = viewMode === 'flat';

            const pivot = new WDR({
                container: container,
                toolbar: true,
                report: {
                    dataSource: { data },
                    slice: isFlat ? {
                        rows: [
                            { uniqueName: 'Full Name' },
                            { uniqueName: 'Country' },
                            { uniqueName: 'Age' },
                            { uniqueName: 'Gender' },
                            { uniqueName: 'Specialty' }
                        ],
                        columns: [],
                        measures: []
                    } : {
                        rows: [{ uniqueName: 'Country' }],
                        columns: [{ uniqueName: 'Measures' }],
                        measures: [{
                            uniqueName: 'Age',
                            aggregation: 'average',
                            format: 'age-format',
                            caption: "Average Age"
                        }],
                    },
                    formats: [
                        {
                            name: 'age-format',
                            decimalPlaces: 1
                        }
                    ],
                    options: {
                        grid: {
                            type: isFlat ? 'flat' : 'compact'
                        }
                    }
                },
            });

            return () => {
                pivot.dispose();
                container.innerHTML = '';
            };
        } catch {
            setErrorMsg('Failed to initialize pivot table');
        }
    }, [isLoaded, data, viewMode]);

    return (
        <div className="country-report" style={{ marginTop: 'var(--space-8)' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button
                    type="button"
                    className={`btn ${viewMode === 'country' ? 'btn--primary' : ''}`}
                    onClick={() => setViewMode('country')}
                    style={viewMode === 'country' ? { background: 'var(--accent)', color: 'white' } : {}}
                >
                    Group by Country
                </button>
                <button
                    type="button"
                    className={`btn ${viewMode === 'flat' ? 'btn--primary' : ''}`}
                    onClick={() => setViewMode('flat')}
                    style={viewMode === 'flat' ? { background: 'var(--accent)', color: 'white' } : {}}
                >
                    All Teachers (Flat Table)
                </button>
            </div>

            {errorMsg && <p style={{ textAlign: 'center', color: 'red' }}>{errorMsg}</p>}
            {!isLoaded && !errorMsg && <p style={{ textAlign: 'center' }}>Loading report…</p>}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: isLoaded && !errorMsg ? '500px' : '0px',
                    overflow: 'hidden'
                }}
            />
        </div>
    );
};

export default CountryReport;
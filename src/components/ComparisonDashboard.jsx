import React from 'react';
import { Download, RefreshCw, FileText, UploadCloud, Search, CheckCircle, XCircle, FileSpreadsheet } from 'lucide-react';

export function ComparisonDashboard({ 
    state, 
    updateConfig, 
    missingResults, 
    fetchResults, 
    compareResults,
    activeTab,
    setActiveTab
}) {
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };



    const commonHeaders = state.headers1.filter(h => state.headers2.includes(h));
    
    // Stats Calculations
    const missingCount = missingResults.filter(r => r.__status === 'Missing').length;
    const availCount = missingResults.filter(r => r.__status === 'Available').length;
    
    const matchCount = compareResults.filter(r => r.__compareStatus === 'Match').length;
    const mismatchCount = compareResults.filter(r => r.__compareStatus === 'Mismatch').length;
    const notFoundCount = compareResults.filter(r => r.__compareStatus === 'Not Found').length;

    return (
        <div className="page active" id="results-page">
            <div className="ambient-glow ambient-glow--1"></div>
            <div className="ambient-glow ambient-glow--3"></div>

            <section className="config-bar">
                <div className="config-bar__group">
                    <label className="config-bar__label">Key Field (for lookup)</label>
                    <select 
                        className="config-select" 
                        value={state.keyField}
                        onChange={(e) => updateConfig('keyField', e.target.value)}
                    >
                        {commonHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="config-bar__group">
                    <label className="config-bar__label">Compare Field</label>
                    <select 
                        className="config-select" 
                        value={state.compareField}
                        onChange={(e) => updateConfig('compareField', e.target.value)}
                    >
                        {commonHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="config-bar__group">
                    <label className="config-bar__label">Fetch Field (from Sheet 2)</label>
                    <select 
                        className="config-select" 
                        value={state.fetchField}
                        onChange={(e) => updateConfig('fetchField', e.target.value)}
                    >
                        {state.headers2.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </section>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'missing' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('missing')}
                >
                    <Search size={16} />
                    Missing Records
                    <span className="tab__count">{missingCount}</span>
                </button>
                <button 
                    className={`tab ${activeTab === 'fetch' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('fetch')}
                >
                    <Download size={16} />
                    Fetch Data
                </button>
                <button 
                    className={`tab ${activeTab === 'compare' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('compare')}
                >
                    <FileText size={16} />
                    Compare Values
                    <span className="tab__count">{mismatchCount}</span>
                </button>
            </div>

            <div className="results-layout">
                <div className="results-main">
                    {/* Missing Records Tab Content */}
                    {activeTab === 'missing' && (
                        <div className="tab-content active">
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            {state.headers1.slice(0, 5).map(h => <th key={h}>{h}</th>)}
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {missingResults.map((r, i) => (
                                            <tr key={i}>
                                                {state.headers1.slice(0, 5).map(h => <td key={h}>{r[h]}</td>)}
                                                <td>
                                                    <span className={`badge ${r.__status === 'Available' ? 'badge--available' : 'badge--missing'}`}>
                                                        <span className="badge__dot"></span>{r.__status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {missingCount === 0 && (
                                <div className="empty-state">
                                    <CheckCircle size={48} strokeWidth={1.5} color="#464554" />
                                    <p>No missing records found. All records are present in both sheets!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fetch Data Tab Content */}
                    {activeTab === 'fetch' && (
                        <div className="tab-content active">
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            {state.headers1.slice(0, 4).map(h => <th key={h}>{h}</th>)}
                                            <th>{state.fetchField} (from Sheet 2)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchResults.map((r, i) => (
                                            <tr key={i}>
                                                {state.headers1.slice(0, 4).map(h => <td key={h}>{r[h]}</td>)}
                                                <td>{r.__fetched === 'Not Found' 
                                                    ? <span className="badge badge--notfound"><span className="badge__dot"></span>Not Found</span> 
                                                    : r.__fetched}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Compare Values Tab Content */}
                    {activeTab === 'compare' && (
                        <div className="tab-content active">
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>{state.keyField}</th>
                                            <th>{state.compareField} (Sheet 1)</th>
                                            <th>{state.compareField} (Sheet 2)</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {compareResults.map((r, i) => {
                                            let badgeClass = 'badge--match';
                                            if (r.__compareStatus === 'Mismatch') badgeClass = 'badge--mismatch';
                                            if (r.__compareStatus === 'Not Found') badgeClass = 'badge--notfound';

                                            return (
                                                <tr key={i}>
                                                    <td>{r[state.keyField]}</td>
                                                    <td>{r[state.compareField]}</td>
                                                    <td>{r.__sheet2Value}</td>
                                                    <td><span className={`badge ${badgeClass}`}><span className="badge__dot"></span>{r.__compareStatus}</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {mismatchCount === 0 && notFoundCount === 0 && (
                                <div className="empty-state">
                                    <CheckCircle size={48} strokeWidth={1.5} color="#464554" />
                                    <p>All values match perfectly across both sheets!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <aside className="results-sidebar">
                    <div className="summary-card">
                        <h3 className="summary-card__title">Comparison Summary</h3>
                        <div className="summary-stat">
                            <span className="summary-stat__label">Total Records (Sheet 1)</span>
                            <span className="summary-stat__value">{missingResults.length}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="summary-stat__label">Available in Sheet 2</span>
                            <span className="summary-stat__value summary-stat__value--success">{availCount}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="summary-stat__label">Missing from Sheet 2</span>
                            <span className="summary-stat__value summary-stat__value--error">{missingCount}</span>
                        </div>
                        <hr className="summary-divider" />
                        <div className="summary-stat">
                            <span className="summary-stat__label">Value Matches</span>
                            <span className="summary-stat__value summary-stat__value--success">{matchCount}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="summary-stat__label">Value Mismatches</span>
                            <span className="summary-stat__value summary-stat__value--error">{mismatchCount}</span>
                        </div>
                        <div className="summary-stat">
                            <span className="summary-stat__label">Not Found</span>
                            <span className="summary-stat__value summary-stat__value--warn">{notFoundCount}</span>
                        </div>
                    </div>

                    <div className="summary-card summary-card--files">
                        <h3 className="summary-card__title">Loaded Files</h3>
                        <div className="summary-file">
                            <span className="summary-file__label">Sheet 1</span>
                            <span className="summary-file__name">{state.file1?.name || '—'}</span>
                        </div>
                        <div className="summary-file">
                            <span className="summary-file__label">Sheet 2</span>
                            <span className="summary-file__name">{state.file2?.name || '—'}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Play, HelpCircle, Layers } from 'lucide-react';
import { useComparison } from './hooks/useComparison';
import { FileUploader } from './components/FileUploader';
import { ComparisonDashboard } from './components/ComparisonDashboard';
import { Instructions } from './components/Instructions';

export default function App() {
    const { 
        state, 
        formatBytes, 
        handleFileUpload, 
        removeFile, 
        initializeFields, 
        updateConfig,
        missingResults,
        fetchResults,
        compareResults,
        exportResults
    } = useComparison();

    const [view, setView] = useState('landing'); // 'landing' | 'results' | 'instructions'
    const [activeTab, setActiveTab] = useState('missing');

    const canStartCompare = state.data1 && state.data2;

    const startComparison = () => {
        if (!canStartCompare) return;
        initializeFields();
        setView('results');
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* Global Header */}
            <header className="header">
                <div className="header__logo">
                    {view === 'results' && (
                        <button className="btn-back" onClick={() => setView('landing')} aria-label="Go back" style={{marginRight: '12px'}}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
                        </button>
                    )}
                    {(view === 'results' || view === 'landing') && (
                        <div className="header__icon">
                            <Layers size={28} color="#8083ff" strokeWidth={1.5} style={{fill: 'rgba(87, 27, 193, 0.2)'}} />
                        </div>
                    )}
                    <span className="header__title" style={{cursor: 'pointer'}} onClick={() => setView('landing')}>
                        SheetCompare
                    </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {view !== 'instructions' && (
                        <button 
                            className="header__link" 
                            onClick={() => setView('instructions')}
                            style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
                        >
                            <HelpCircle size={18} />
                            <span>Instructions</span>
                        </button>
                    )}
                    {view === 'results' && (
                        <button 
                            className="btn-export" 
                            onClick={() => exportResults(activeTab)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            <span>Export Results</span>
                        </button>
                    )}
                </div>
                {view === 'instructions' && (
                    <button 
                        className="header__link" 
                        onClick={() => setView('landing')}
                        style={{textDecoration: 'none', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
                    >
                        Back to App
                    </button>
                )}
            </header>

            {/* Toasts */}
            {state.toastInfo && (
                <div className="toast-container">
                    <div className={`toast toast--${state.toastInfo.type}`}>
                        {state.toastInfo.message}
                    </div>
                </div>
            )}

            {/* Views */}
            {view === 'landing' && (
                <div className="page active" id="landing-page">
                    <div className="ambient-glow ambient-glow--1"></div>
                    <div className="ambient-glow ambient-glow--2"></div>
                    
                    <section className="hero">
                        <div className="hero__badge">
                            <span className="hero__badge-dot"></span>
                            <span>Powered by Smart React Engine</span>
                        </div>
                        <h1 className="hero__title">
                            Compare Excel Sheets<br/>
                            <span className="hero__title--gradient">Instantly</span>
                        </h1>
                        <p className="hero__subtitle">
                            Upload two Excel sheets and let SheetCompare identify missing records,
                            fetch related data, and compare values — all in seconds.
                        </p>
                    </section>

                    <section className="upload-section">
                        <FileUploader 
                            label="Sheet 1"
                            file={state.file1}
                            fileName={state.file1?.name}
                            fileSize={state.file1 ? formatBytes(state.file1.size) : null}
                            onUpload={(f) => handleFileUpload(f, 'file1')}
                            onRemove={() => removeFile('file1')}
                        />
                        <div className="upload-section__divider">
                            <div className="upload-section__vs">VS</div>
                        </div>
                        <FileUploader 
                            label="Sheet 2"
                            file={state.file2}
                            fileName={state.file2?.name}
                            fileSize={state.file2 ? formatBytes(state.file2.size) : null}
                            onUpload={(f) => handleFileUpload(f, 'file2')}
                            onRemove={() => removeFile('file2')}
                        />
                    </section>

                    <section className="cta-section">
                        <button 
                            className="btn-compare" 
                            onClick={startComparison}
                            disabled={!canStartCompare}
                        >
                            <Play size={22} fill="currentColor" />
                            <span>Start Compare</span>
                        </button>
                        <p className="cta-section__hint">Upload both sheets to begin comparison</p>
                    </section>
                </div>
            )}

            {view === 'results' && (
                <ComparisonDashboard 
                    state={state}
                    updateConfig={updateConfig}
                    missingResults={missingResults}
                    fetchResults={fetchResults}
                    compareResults={compareResults}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}

            {view === 'instructions' && (
                <div className="page active">
                    <div className="ambient-glow ambient-glow--1"></div>
                    <div className="ambient-glow ambient-glow--2"></div>
                    <Instructions />
                </div>
            )}
        </div>
    );
}

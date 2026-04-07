import React from 'react';
import { Download, Settings2, Search, FileUp } from 'lucide-react';

export function Instructions() {
    return (
        <div className="instructions-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <style>
                {`
                .instructions-page h1 { color: var(--text-primary); font-size: 2.5rem; margin-bottom: 2rem; text-align: center; }
                .instructions-page h2 { color: var(--text-primary); font-size: 1.5rem; margin-top: 2.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem; }
                .instructions-page h2 svg { color: var(--primary); }
                .instructions-page p { line-height: 1.6; margin-bottom: 1rem; }
                .instructions-page ol, .instructions-page ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
                .instructions-page li { margin-bottom: 0.75rem; line-height: 1.6; color: var(--on-surface-variant); }
                .instructions-card { background: var(--surface-1); border: 1px solid var(--surface-container-high); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-sm); }
                .badge-inline { display: inline-flex; align-items: center; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; background: var(--surface-container-highest); color: var(--on-surface); }
                .badge-inline.success { color: var(--success); background: rgba(16, 185, 129, 0.1); }
                .badge-inline.error { color: var(--error); background: rgba(239, 68, 68, 0.1); }
                `}
            </style>
            <h1>How to use the comparison</h1>
            <div className="instructions-card">
                <h2><FileUp size={24} /> Step 1: Upload Your Files</h2>
                <p>On the main landing page, you will see two upload zones labeled <strong>Sheet 1</strong> and <strong>Sheet 2</strong>.</p>
                <ul>
                    <li>Drag and drop your Excel files (<code>.xlsx</code>, <code>.xls</code>) or <code>.csv</code> files into the respective zones.</li>
                    <li>Alternatively, click on the upload zone to open your computer's browser and select the files manually.</li>
                    <li>Once both files are uploaded, click the purple <strong>Start Compare</strong> button to proceed.</li>
                </ul>

                <h2><Settings2 size={24} /> Step 2: Configure Comparison</h2>
                <p>At the top of the Results Dashboard, you will find three dropdown menus dynamically populated with columns:</p>
                <ul>
                    <li><strong>Key Field (for lookup)</strong>: The common identifier that exists in both sheets (e.g., <em>Employee ID</em>).</li>
                    <li><strong>Compare Field</strong>: The specific data column you want to check for matches/mismatches.</li>
                    <li><strong>Fetch Field</strong>: The data column you want to pull directly from Sheet 2 into Sheet 1.</li>
                </ul>

                <h2><Search size={24} /> Step 3: Analyze the Results</h2>
                <p>You can toggle between three tasks using the tabs located just below the configuration bar:</p>
                <ol>
                    <li><strong>Missing Records Tab:</strong> Identifies which records exist in Sheet 1. Displays <span className="badge-inline success">Available</span> if the Key Field exists in Sheet 2, and <span className="badge-inline error">Missing</span> if it does not.</li>
                    <li><strong>Fetch Data Tab:</strong> Acts exactly like a VLOOKUP. It pulls the requested "Fetch Field" data out of Sheet 2 and places it alongside Sheet 1. Displays <span className="badge-inline error">Not Found</span> if missing.</li>
                    <li><strong>Compare Values Tab:</strong> Places the data from your "Compare Field" from both sheets right next to each other. Displays <span className="badge-inline success">Match</span> if identical, or <span className="badge-inline error">Mismatch</span> if there is a discrepancy.</li>
                </ol>

                <h2><Download size={24} /> Step 4: Export to Excel</h2>
                <p>Once you are happy with the generated comparisons, click the <strong>Export Results</strong> button at the top right of the dashboard. This will generate a combined <code>.xlsx</code> Excel file of the currently viewing tab straight to your computer.</p>
            </div>
        </div>
    );
}

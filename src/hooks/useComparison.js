import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';

export function useComparison() {
    const [state, setState] = useState({
        file1: null,
        file2: null,
        data1: null,
        data2: null,
        headers1: [],
        headers2: [],
        keyField: '',
        compareField: '',
        fetchField: '',
        loading: false,
        toastInfo: null
    });

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const parseFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheet];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                    
                    if (jsonData.length === 0) {
                        reject(new Error('Sheet is empty or has no data rows'));
                        return;
                    }
                    const headers = Object.keys(jsonData[0]);
                    resolve({ data: jsonData, headers });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFileUpload = async (file, fileKey) => {
        const validExts = ['.xlsx', '.xls', '.csv'];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validExts.includes(ext)) {
            showToast('Please upload .xlsx, .xls, or .csv files only', 'error');
            return;
        }

        try {
            const result = await parseFile(file);
            setState(prev => ({
                ...prev,
                [fileKey]: file,
                [`data${fileKey.slice(-1)}`]: result.data,
                [`headers${fileKey.slice(-1)}`]: result.headers
            }));
            showToast(`${file.name} loaded — ${result.data.length} rows`);
        } catch (err) {
            showToast(`Error reading ${file.name}: ${err.message}`, 'error');
        }
    };

    const removeFile = (fileKey) => {
        setState(prev => ({
            ...prev,
            [fileKey]: null,
            [`data${fileKey.slice(-1)}`]: null,
            [`headers${fileKey.slice(-1)}`]: []
        }));
    };

    const showToast = (message, type = 'success') => {
        setState(prev => ({ ...prev, toastInfo: { message, type } }));
        setTimeout(() => {
            setState(prev => ({ ...prev, toastInfo: null }));
        }, 3000);
    };

    const initializeFields = () => {
        const { headers1, headers2 } = state;
        const commonHeaders = headers1.filter(h => headers2.includes(h));
        
        setState(prev => ({
            ...prev,
            keyField: prev.keyField || commonHeaders[0] || '',
            compareField: prev.compareField || commonHeaders[commonHeaders.length > 1 ? 1 : 0] || '',
            fetchField: prev.fetchField || headers2[headers2.length > 1 ? 1 : 0] || ''
        }));
    };

    const updateConfig = (field, value) => {
        setState(prev => ({ ...prev, [field]: value }));
    };

    // Memoized Results
    const missingResults = useMemo(() => {
        if (!state.data1 || !state.data2 || !state.keyField) return [];
        const key = state.keyField;
        const sheet2Keys = new Set(state.data2.map(row => String(row[key]).trim().toLowerCase()));

        return state.data1.map(row => {
            const val = String(row[key]).trim().toLowerCase();
            const found = sheet2Keys.has(val);
            return { ...row, __status: found ? 'Available' : 'Missing' };
        });
    }, [state.data1, state.data2, state.keyField]);

    const fetchResults = useMemo(() => {
        if (!state.data1 || !state.data2 || !state.keyField || !state.fetchField) return [];
        const key = state.keyField;
        const fetchField = state.fetchField;

        const lookupMap = {};
        state.data2.forEach(row => {
            const k = String(row[key]).trim().toLowerCase();
            if (!lookupMap.hasOwnProperty(k)) {
                lookupMap[k] = row[fetchField] !== undefined ? row[fetchField] : 'Not Found';
            }
        });

        return state.data1.map(row => {
            const val = String(row[key]).trim().toLowerCase();
            const fetched = lookupMap.hasOwnProperty(val) ? lookupMap[val] : 'Not Found';
            return { ...row, __fetched: fetched };
        });
    }, [state.data1, state.data2, state.keyField, state.fetchField]);

    const compareResults = useMemo(() => {
        if (!state.data1 || !state.data2 || !state.keyField || !state.compareField) return [];
        const key = state.keyField;
        const cmpField = state.compareField;

        const lookupMap = {};
        state.data2.forEach(row => {
            const k = String(row[key]).trim().toLowerCase();
            if (!lookupMap.hasOwnProperty(k)) {
                lookupMap[k] = row;
            }
        });

        return state.data1.map(row => {
            const val = String(row[key]).trim().toLowerCase();
            if (!lookupMap.hasOwnProperty(val)) {
                return { ...row, __sheet2Value: '—', __compareStatus: 'Not Found' };
            }
            const sheet2Row = lookupMap[val];
            const v1 = String(row[cmpField]).trim();
            const v2 = String(sheet2Row[cmpField]).trim();
            const match = v1.toLowerCase() === v2.toLowerCase();
            
            return {
                ...row,
                __sheet2Value: sheet2Row[cmpField],
                __compareStatus: match ? 'Match' : 'Mismatch'
            };
        });
    }, [state.data1, state.data2, state.keyField, state.compareField]);

    const exportResults = (tabId) => {
        let exportData = [];
        
        if (tabId === 'missing') {
            exportData = missingResults.map(r => {
                const out = {};
                state.headers1.forEach(h => out[h] = r[h]);
                out['Status'] = r.__status;
                return out;
            });
        } else if (tabId === 'fetch') {
            exportData = fetchResults.map(r => {
                const out = {};
                state.headers1.forEach(h => out[h] = r[h]);
                out[`${state.fetchField} (from Sheet 2)`] = r.__fetched;
                return out;
            });
        } else if (tabId === 'compare') {
            exportData = compareResults.map(r => {
                const out = {};
                out[state.keyField] = r[state.keyField];
                out[`${state.compareField} (Sheet 1)`] = r[state.compareField];
                out[`${state.compareField} (Sheet 2)`] = r.__sheet2Value;
                out['Result'] = r.__compareStatus;
                return out;
            });
        }

        if (exportData.length === 0) {
            showToast('No data to export', 'error');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Comparison_Results");
        XLSX.writeFile(wb, `SheetCompare_${tabId}_results.xlsx`);
        showToast('Results exported as Excel file');
    };

    return {
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
    };
}

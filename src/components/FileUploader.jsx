import React, { useRef, useState } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';

export function FileUploader({ label, file, onUpload, onRemove, fileSize, fileName }) {
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleClick = (e) => {
        if (e.target.closest('.file-chip__remove')) return;
        fileInputRef.current?.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0]);
        }
        // Reset so same file can be selected again if removed
        e.target.value = null; 
    };

    return (
        <div className="upload-card">
            <div className="upload-card__label">{label}</div>
            <div 
                className={`upload-card__dropzone ${isDragOver ? 'dragover' : ''} ${file ? 'has-file' : ''}`}
                onClick={handleClick}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="upload-card__icon">
                    <Upload size={48} strokeWidth={1.5} />
                </div>
                <p className="upload-card__text">Drop your Excel file here</p>
                <p className="upload-card__subtext">or click to browse</p>
                <p className="upload-card__formats">.xlsx, .xls, .csv</p>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="upload-card__input" 
                    accept=".xlsx,.xls,.csv"
                    onChange={handleChange}
                    style={{display: 'none'}}
                />
            </div>

            {file && (
                <div className="upload-card__file-info" style={{ animation: 'slideUp 0.3s ease' }}>
                    <div className="file-chip">
                        <FileSpreadsheet size={20} color="#10B981" />
                        <div className="file-chip__details">
                            <span className="file-chip__name">{fileName}</span>
                            <span className="file-chip__size">{fileSize}</span>
                        </div>
                        <button className="file-chip__remove" onClick={onRemove} aria-label="Remove file">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

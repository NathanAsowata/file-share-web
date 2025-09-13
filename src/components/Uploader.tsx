/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, } from 'react';
import FileUploader from './FileUploader';
import TextUploader from './TextUploader';
import ResultView from './ResultView';
import { uploadContent } from '../services/api';
import styles from '../styles/Uploader.module.css'
import { FileIcon, TextTIcon } from '@phosphor-icons/react';

type UploadMode = 'file' | 'text';

interface UploadResult {
  viewUrl: string;
  expiresAt: string;
}

const Uploader: React.FC = () => {
  const [mode, setMode] = useState<UploadMode>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    const formData = new FormData();
    let hasContent = false;

    if (mode === 'file' && selectedFile) {
      formData.append('file', selectedFile);
      hasContent = true;
    } else if (mode === 'text' && text.trim()) {
      formData.append('text', text);
      hasContent = true;
    }

    if (!hasContent) {
      setError('Please select a file or enter some text to upload.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await uploadContent(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });
      setResult(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return <ResultView viewUrl={result.viewUrl} expiresAt={result.expiresAt} />;
  }

  return (
    <div className={styles.uploaderContainer}>
      <header className={styles.header}>
        <h1>Share files safely</h1>
        <p>Minimalist, secure, and temporary content sharing</p>
      </header>

      <div className={styles.tabs}>
        <button onClick={() => setMode('file')} className={mode === 'file' ? styles.active : ''}>
          <FileIcon size={18} /> File
        </button>
        <button onClick={() => setMode('text')} className={mode === 'text' ? styles.active : ''}>
          <TextTIcon size={18} /> Text
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'file' ? (
          <FileUploader onFileSelect={setSelectedFile} selectedFile={selectedFile} />
        ) : (
          <TextUploader text={text} onTextChange={setText} />
        )}
      </div>

      {isLoading && (
        <div className={styles.progressContainer}>
          <p>Uploading...</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}

      <button onClick={handleUpload} disabled={isLoading} className={styles.uploadButton}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default Uploader;
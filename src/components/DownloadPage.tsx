import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMetadata } from '../services/api';
import { format, isPast } from 'date-fns';
import { DownloadSimpleIcon, WarningCircleIcon, CopyIcon } from '@phosphor-icons/react';
import styles from '../styles/DownloadPage.module.css';

interface Metadata {
  shortId: string;
  originalFilename: string;
  uploadType: 'FILE' | 'TEXT';
  textContent?: string;
  expiresAt: string;
}

const DownloadPage: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortId) return;

    const fetchMetadata = async () => {
      try {
        const response = await getMetadata(shortId);
        if (isPast(new Date(response.data.expiresAt))) {
            setError('This link has expired.');
        } else {
            setMetadata(response.data);
        }
      } catch (err) {
        setError('File not found or has expired.' + err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [shortId]);

  const handleDownload = () => {
    const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/download/${shortId}`;
    window.location.href = downloadUrl;
  };

  const handleCopyText = () => {
  if (metadata?.textContent) {
    navigator.clipboard.writeText(metadata.textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  }
};

  if (isLoading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className={`${styles.container} ${styles.errorContainer}`}>
        <WarningCircleIcon size={48} color="#d32f2f" />
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!metadata) {
    return null; // Should not happen if not loading and no error
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>{metadata.originalFilename}</h2>
        <p className={styles.expiresText}>
          Expires: {format(new Date(metadata.expiresAt), "MMMM d, yyyy 'at' h:mm a")}
        </p>
      </header>

      {metadata.uploadType === 'TEXT' && metadata.textContent && (
        <div className={styles.textContent}>
          <pre>{metadata.textContent}</pre>
        </div>
      )}

     <div className={styles.buttonContainer}>
      {metadata.uploadType === 'TEXT' && metadata.textContent && (
        <button onClick={handleCopyText} className={styles.copyButton}>
          <CopyIcon size={22} weight="bold" />
          {isCopied ? 'Copied!' : 'Copy Text'}
        </button>
      )}
      <button onClick={handleDownload} className={styles.downloadButton}>
        <DownloadSimpleIcon size={22} weight="bold" />
        Download
    </button>
</div>
    </div>
  );
};

export default DownloadPage;
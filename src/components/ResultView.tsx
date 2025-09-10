import React, { useState } from 'react';
import { format } from 'date-fns';
import { CopyIcon } from '@phosphor-icons/react';
import styles from '../styles/Uploader.module.css'

interface ResultViewProps {
  viewUrl: string;
  expiresAt: string;
}

const ResultView: React.FC<ResultViewProps> = ({ viewUrl, expiresAt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(viewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.resultContainer}>
      <h2>Upload Successful!</h2>
      <p>Your content is now available at the following link:</p>
      <div className={styles.urlInputContainer}>
        <input type="text" value={viewUrl} readOnly className={styles.urlInput} />
        <button onClick={handleCopy} className={styles.copyButton}>
          <CopyIcon size={20} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className={styles.expiresText}>
        This link will expire on: {format(new Date(expiresAt), "MMMM d, yyyy 'at' h:mm a")}
      </p>
    </div>
  );
};

export default ResultView;
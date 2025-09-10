import React from 'react';
import styles from '../styles/Uploader.module.css'

const CHAR_LIMIT = 100000;

interface TextUploaderProps {
  text: string;
  onTextChange: (text: string) => void;
}

const TextUploader: React.FC<TextUploaderProps> = ({ text, onTextChange }) => {
  return (
    <div className={styles.textUploaderContainer}>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your text snippet here..."
        maxLength={CHAR_LIMIT}
      />
      <div className={styles.charCount}>
        {text.length.toLocaleString()} / {CHAR_LIMIT.toLocaleString()}
      </div>
    </div>
  );
};

export default TextUploader;
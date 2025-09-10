import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from '@phosphor-icons/react';
import styles from '../styles/Uploader.module.css'

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile }) => {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
      <input {...getInputProps()} />
      <UploadIcon size={48} weight="light" color="#374a43" />
      {selectedFile ? (
        <p>{selectedFile.name}</p>
      ) : (
        <p>{isDragActive ? 'Drop the file here ...' : 'Drag & drop a file here, or click to select'}</p>
      )}
    </div>
  );
};

export default FileUploader;
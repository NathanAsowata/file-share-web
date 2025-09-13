import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.appHeader}>
      <Link to="/" className={styles.logoLink}>
        FileShare
      </Link>
    </header>
  );
};

export default Header;
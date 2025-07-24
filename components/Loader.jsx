// components/Loader.jsx
import React from 'react';
import styles from './GenerateCaptions.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderBox}>
      <img
        src="/loader.gif"
        alt="Loading..."
        className={styles.gifLoader}
      />
    </div>
  );
};

export default Loader;

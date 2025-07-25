'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <img src="/Logo.svg" alt="CaptionSpark logo" width={32} height={32} />
      </Link>
    </header>
  );
}
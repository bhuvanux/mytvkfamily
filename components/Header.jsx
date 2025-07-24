'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import styles from './Header.module.css';

export default function Header() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <img src="/Logo.svg" alt="CaptionSpark logo" width={32} height={32} />
      </Link>

    
    </header>
  );
}

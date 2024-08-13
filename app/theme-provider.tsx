'use client';

import { useAppSettingsStore } from '@/store/app-settings/store';
import { Theme } from '@/store/app-settings/types';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { useEffect, useState } from 'react';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppSettingsStore();
  
  useEffect(() => {
    if (theme) {
      switch (theme) {
        case Theme.DARK:
          document.body.classList.toggle('dark', true);
          break;
        case Theme.LIGHT:
          document.body.classList.toggle('dark', false);
          break;
      }
    }
  }, [theme]);

  return children;
}

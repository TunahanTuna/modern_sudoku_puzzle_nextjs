'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={`Switch to ${language === 'tr' ? 'English' : 'Turkish'}`}
    >
      <Image
        src="./globe.svg"
        alt="Language"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span className="ml-2 text-sm font-medium">{language.toUpperCase()}</span>
    </button>
  );
}
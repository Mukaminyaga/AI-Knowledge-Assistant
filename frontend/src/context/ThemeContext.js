import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  useEffect(() => {
    // Apply theme class to body element
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Light theme colors
      light: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        tertiary: '#E5E7EB',
        text: '#374151',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        background: '#FFFFFF',
        cardBackground: '#FFFFFF',
        sidebarBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      },
      // Dark theme colors (from design)
      dark: {
        primary: '#1A1A1A',
        secondary: '#303030',
        tertiary: '#252525',
        text: '#FCFCFC',
        textSecondary: '#ACAAAA',
        border: '#303030',
        background: '#1A1A1A',
        cardBackground: '#000000',
        sidebarBackground: '#1A1A1A',
        headerBackground: '#1A1A1A'
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

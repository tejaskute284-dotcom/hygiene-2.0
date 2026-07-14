import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { useThemeStore } from '@/lib/store';

// Mock the store
jest.mock('@/lib/store', () => ({
  useThemeStore: jest.fn(),
}));

// Mock the API
jest.mock('@/lib/api', () => ({
  usersApi: {
    updateSettings: jest.fn(),
  },
}));

describe('ThemeToggle Component', () => {
  let mockSetThemeMode: jest.Mock;

  beforeEach(() => {
    mockSetThemeMode = jest.fn();
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      themeMode: 'light',
      setThemeMode: mockSetThemeMode,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveTextContent(/Light Mode/i);
    // Sun icon should be rendered by Lucide in light mode, but the text is the easiest to assert
  });

  it('renders correctly in dark mode', () => {
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      themeMode: 'dark',
      setThemeMode: mockSetThemeMode,
    });

    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveTextContent(/Dark Mode/i);
  });

  it('calls setThemeMode and API on click', async () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');

    // We wrap in act because toggleTheme is async and might cause state updates
    await act(async () => {
      await userEvent.click(button);
    });

    expect(mockSetThemeMode).toHaveBeenCalledWith('dark');

    // Check if dynamic import and API call was triggered. Since it's dynamic import we might need to await something or just check it after microtasks
    // Actually the mock for API should have been hit
    const { usersApi } = await import('@/lib/api');
    expect(usersApi.updateSettings).toHaveBeenCalledWith({ uiMode: 'dark' });
  });
});

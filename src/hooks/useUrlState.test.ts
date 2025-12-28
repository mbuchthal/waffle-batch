import { renderHook, act } from '@testing-library/react';
import { useUrlState } from './useUrlState';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('useUrlState', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location
    const mockLocation = {
      ...originalLocation,
      search: '',
      pathname: '/',
      assign: vi.fn(),
      replace: vi.fn(),
    };

    // We need to redefine window.location to mock it
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });

    // Mock history.replaceState
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('should initialize with default value when URL param is missing', () => {
    const { result } = renderHook(() => useUrlState<string>('query', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should initialize with URL param value', () => {
    window.location.search = '?query=initial';
    const { result } = renderHook(() => useUrlState<string>('query', 'default'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update state and URL when setter is called', () => {
    const { result } = renderHook(() => useUrlState<string>('query', 'default'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = new URLSearchParams((window.history.replaceState as any).mock.calls[0][2].split('?')[1]);
    expect(params.get('query')).toBe('updated');
  });

  it('should handle boolean values', () => {
    window.location.search = '?flag=true';
    const { result } = renderHook(() => useUrlState<boolean>('flag', false));
    expect(result.current[0]).toBe(true);
  });

  it('should remove param from URL if value equals default', () => {
    window.location.search = '?query=initial';
    const { result } = renderHook(() => useUrlState<string>('query', 'default'));

    act(() => {
      result.current[1]('default');
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = (window.history.replaceState as any).mock.calls[0][2];
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.has('query')).toBe(false);
  });
});

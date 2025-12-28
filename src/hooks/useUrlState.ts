import { useState, useCallback, useEffect } from 'react';

/**
 * A hook to sync state with a URL query parameter.
 * @param key The query parameter key (e.g., 'search', 'sort').
 * @param initialValue The default value if the param is missing.
 * @returns [value, setValue] tuple.
 */
export function useUrlState<T extends string | boolean>(
  key: string,
  initialValue: T
): [T, (val: T) => void] {
  // Initialize state from URL if present, otherwise initialValue
  const [value, setInternalValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    const params = new URLSearchParams(window.location.search);
    const paramVal = params.get(key);

    if (paramVal === null) return initialValue;

    // Handle booleans (stored as string "true"/"false")
    if (typeof initialValue === 'boolean') {
      return (paramVal === 'true') as T;
    }

    return paramVal as T;
  });

  // Update URL whenever the value changes (via the setter)
  const setValue = useCallback((newValue: T) => {
    setInternalValue(newValue);

    const params = new URLSearchParams(window.location.search);

    if (newValue === initialValue || newValue === '') {
      params.delete(key);
    } else {
      params.set(key, String(newValue));
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [key, initialValue]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const paramVal = params.get(key);

      if (paramVal === null) {
        setInternalValue(initialValue);
      } else if (typeof initialValue === 'boolean') {
        setInternalValue((paramVal === 'true') as T);
      } else {
        setInternalValue(paramVal as T);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, initialValue]);

  return [value, setValue];
}

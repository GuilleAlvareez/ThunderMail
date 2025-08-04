/**
 * Utility functions for managing URL parameters
 */

/**
 * Updates a URL parameter without reloading the page
 */
export function updateUrlParam(key: string, value: string | null) {
  const params = new URLSearchParams(window.location.search);
  
  if (value === null || value === '') {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newURL);
}

/**
 * Gets a URL parameter value
 */
export function getUrlParam(key: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Gets a URL parameter value with a default fallback
 */
export function getUrlParamWithDefault(key: string, defaultValue: string): string {
  return getUrlParam(key) || defaultValue;
}

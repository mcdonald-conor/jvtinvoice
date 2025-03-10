/**
 * Safely check if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Safely access the window object
 * @returns The window object or undefined if not in a browser
 */
export const safeWindow = (): (Window & typeof globalThis) | undefined => {
  return isBrowser ? window : undefined;
};

/**
 * Safely access the document object
 * @returns The document object or undefined if not in a browser
 */
export const safeDocument = (): Document | undefined => {
  return isBrowser ? document : undefined;
};

/**
 * Safely access the navigator object
 * @returns The navigator object or undefined if not in a browser
 */
export const safeNavigator = (): Navigator | undefined => {
  return isBrowser ? navigator : undefined;
};

/**
 * Safely check if the device is a mobile device
 * @returns True if the device is mobile, false otherwise
 */
export const isMobileDevice = (): boolean => {
  const navigator = safeNavigator();
  if (!navigator) return false;

  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

/**
 * Safely execute a function only in the browser
 * @param fn Function to execute
 */
export const onlyInBrowser = (fn: () => void): void => {
  if (isBrowser) {
    fn();
  }
};

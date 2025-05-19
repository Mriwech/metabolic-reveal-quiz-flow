
/**
 * Detect device type based on user agent
 */
const detectDeviceType = (userAgent: string): string => {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|phone/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Detect browser based on user agent
 */
const detectBrowser = (userAgent: string): string => {
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
  return 'Unknown';
};

/**
 * Detect operating system based on user agent
 */
const detectOS = (userAgent: string): string => {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
  return 'Unknown';
};

/**
 * Get screen size
 */
const getScreenSize = (): string => {
  return `${window.screen.width}x${window.screen.height}`;
};

/**
 * Gather device information in one function
 */
export const detectDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  return {
    deviceType: detectDeviceType(userAgent),
    browser: detectBrowser(userAgent),
    operatingSystem: detectOS(userAgent),
    screenSize: getScreenSize(),
    userAgent
  };
};

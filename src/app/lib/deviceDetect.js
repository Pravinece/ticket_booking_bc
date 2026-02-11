'use server'
import { headers } from 'next/headers';

export function isMobileDevice() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

export function isTablet() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  
  const tabletRegex = /iPad|Android(?!.*Mobile)/i;
  return tabletRegex.test(userAgent);
}

export function getDeviceType() {
  if (isTablet()) return 'tablet';
  if (isMobileDevice()) return 'mobile';
  return 'desktop';
}

export function restrictMobileAccess() {
  if (isMobileDevice()) {
    return { 
      allowed: false, 
      message: "Mobile access is not allowed. Please use a desktop browser." 
    };
  }
  return { allowed: true };
}
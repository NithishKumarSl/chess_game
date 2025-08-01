// AI Utilities for quota management and error handling

export const GEMINI_QUOTA_LIMITS = {
  FREE_TIER: {
    REQUESTS_PER_DAY: 50,
    REQUESTS_PER_MINUTE: 15,
    MODEL: 'gemini-2.0-flash-exp'
  }
};

export const isQuotaExceededError = (error: any): boolean => {
  if (!error || !error.message) return false;
  
  return error.message.includes('quota') || 
         error.message.includes('429') ||
         error.message.includes('exceeded');
};

export const getQuotaResetTime = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeUntilReset = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const getQuotaStatusMessage = (): string => {
  return `Free tier limit: ${GEMINI_QUOTA_LIMITS.FREE_TIER.REQUESTS_PER_DAY} requests/day. Quota resets in ${getQuotaResetTime()}`;
}; 
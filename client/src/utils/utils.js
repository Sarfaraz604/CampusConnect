/**
 * Date formatting utilities for the forum application
 * Provides human-readable date formats for posts and comments
 */

/**
 * Formats a date string into a readable, localized format
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date (e.g., "March 2, 2025")
 */
export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  /**
   * Calculates and formats the relative time since the given date
   * @param {string} dateString - ISO date string to compare against current time
   * @returns {string} Human-readable time difference (e.g., "just now", "5 minutes ago", "2 hours ago")
   */
  export const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
  
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  /**
   * Returns a formatted date and time string
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date and time (e.g., "March 2, 2025 at 3:45 PM")
   */
  export const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  /**
   * Returns just the time portion of a date
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted time (e.g., "3:45 PM")
   */
  export const formatTime = (dateString) => {
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
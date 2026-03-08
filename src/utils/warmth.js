import { COLORS } from '../constants/theme';

const DAY_MS = 1000 * 60 * 60 * 24;

export function getWarmthState(lastContacted) {
  if (!lastContacted) return 'cold';

  const daysSince = Math.floor((Date.now() - new Date(lastContacted).getTime()) / DAY_MS);

  if (daysSince < 30) return 'warm';
  if (daysSince <= 90) return 'fading';
  return 'cold';
}

export function getWarmthColor(lastContacted) {
  const state = getWarmthState(lastContacted);
  switch (state) {
    case 'warm':
      return COLORS.warmGreen;
    case 'fading':
      return COLORS.fadingAmber;
    case 'cold':
      return COLORS.coldRed;
    default:
      return COLORS.coldRed;
  }
}

export function getLastContactedText(lastContacted) {
  if (!lastContacted) return 'Never contacted';

  const daysSince = Math.floor((Date.now() - new Date(lastContacted).getTime()) / DAY_MS);

  if (daysSince === 0) return 'Today';
  if (daysSince === 1) return 'Yesterday';
  if (daysSince < 7) return `${daysSince} days ago`;
  if (daysSince < 30) {
    const weeks = Math.floor(daysSince / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  if (daysSince < 365) {
    const months = Math.floor(daysSince / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  const years = Math.floor(daysSince / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

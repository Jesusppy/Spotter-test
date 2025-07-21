import dayjs from 'dayjs';

export const formatDuration = (minutes: number): string => {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    return 'N/A';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatTime = (isoDate: string): string => {
  const date = dayjs(isoDate);
  if (!date.isValid()) {
    return 'N/A';
  }
  return date.format('HH:mm');
};
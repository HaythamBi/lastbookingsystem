export function addMinutes(date, minutes) {
  const newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() + minutes);
  return newDate;
}

export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('en-US', {
    ...options,
  }).format(date);
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
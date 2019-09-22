export const formatDateTime = (dateString, formatDate, formatTime) =>
  `${formatDate(dateString)} ${formatTime(dateString, { hour: "numeric", minute: "numeric", second: "numeric" })}`;

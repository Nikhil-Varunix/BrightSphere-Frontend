// utils/time.js
function formatTimeStamp(utcDateString) {
  const date = new Date(utcDateString);

  const options = {
    timeZone: "Asia/Kolkata", // IST
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // change to false for 24-hour format
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

function formatTime(utcDateString) {
  const date = new Date(utcDateString);

  const options = {
    timeZone: "Asia/Kolkata", // IST
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}
function formatDate(utcDateString) {
  const date = new Date(utcDateString);

  const options = {
    timeZone: "Asia/Kolkata", // IST
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

export {formatTimeStamp, formatDate, formatTime}
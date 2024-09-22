const calculateTotalTime = (payload) => {
  const currentLog = payload.currentLog;
  const startTime = currentLog.startTime[currentLog.startTime.length - 1];
  const tempTime = new Date(startTime);
  const newTime = new Date(
    tempTime.getTime() - (currentLog?.durationInSeconds || 0) * 1000,
  );
  const startDate = new Date(newTime.toISOString());
  const currentDate = new Date();
  const timeDifference = currentDate - startDate;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  return {
    hours,
    minutes,
    seconds,
  };
};

// <-- hh:mm Hr -->
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = remainingMinutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} Hr`;
};

const formatDate = (offset) => {
  const today = new Date();
  today.setDate(today.getDate() + offset);

  const day = today.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();

  return `${day} ${month} ${year}`;
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
};

const formatISOdate = (inputDate) => {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Note: Months are zero-based, so we add 1.
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const areTimeIntervalsNonOverlapping = (startTime, endTime) => {
  if (startTime.length !== endTime.length) {
    return false;
  }
  for (let i = 0; i < startTime.length; i++) {
    const currentStartTime = new Date(startTime[i]);
    const currentEndTime = new Date(endTime[i]);
    const nextStartTime = new Date(startTime[i + 1]);
    if (currentEndTime >= nextStartTime || currentEndTime < currentStartTime) {
      return false;
    }
  }
  return true;
};

const calculateTotalDurationInSeconds = (startTime, endTime) => {
  if (startTime.length !== endTime.length) {
    return null;
  }
  let totalDurationInSeconds = 0;
  for (let i = 0; i < startTime.length; i++) {
    const start = new Date(startTime[i]);
    const end = new Date(endTime[i]);
    const durationInSeconds = (end - start) / 1000;
    totalDurationInSeconds += durationInSeconds;
  }
  return Math.floor(totalDurationInSeconds);
};


export {
  calculateTotalTime,
  formatDuration,
  formatDate,
  formatTime,
  formatISOdate,
  areTimeIntervalsNonOverlapping,
  calculateTotalDurationInSeconds
};

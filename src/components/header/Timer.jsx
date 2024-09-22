import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { getTimer, selectTimer } from "##/src/app/timerSlice.js";

export default function Timer({ user, isRunning, setIsRunning }) {
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const dispatchToRedux = useDispatch();
  const { timer: usersTimer, startTime } = useSelector(selectTimer);
  let intervalRef = useRef(null);

  // managing timer through state when loading page
  useEffect(() => {
    setIsRunning(usersTimer?.isRunning || false);
    if (usersTimer && usersTimer.isRunning) {
      setTimer(startTime);
    } else {
      setTimer({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [usersTimer]);

  useEffect(() => {
    if (isRunning && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          const newSeconds = prevTimer.seconds + 1;
          const newMinutes = prevTimer.minutes + Math.floor(newSeconds / 60);
          const newHours = prevTimer.hours + Math.floor(newMinutes / 60);

          return {
            hours: newHours % 24,
            minutes: newMinutes % 60,
            seconds: newSeconds % 60,
          };
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      document.title = "Nexus";
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (user && user.timer) {
      dispatchToRedux(getTimer({ userId: user._id }));
    }
  }, [user]);

  useEffect(() => {
    const updateTitle = () => {
      const formattedTimer = `${timer.hours
        .toString()
        .padStart(2, "0")}:${timer.minutes
        .toString()
        .padStart(2, "0")}:${timer.seconds.toString().padStart(2, "0")}`;
      document.title = `${formattedTimer} - Nexus`;
    };
    if (intervalRef.current) {
      updateTitle();
    } else {
      document.title = "Nexus";
    }
  }, [intervalRef.current, timer]);

  return (
    <Box
      sx={{
        fontSize: "22px",
        position: ["absolute", "absolute", "relative"],
        right: ["20px", "20px", "auto"],
      }}
    >
      {timer.hours.toString().padStart(2, "0")}:
      {timer.minutes.toString().padStart(2, "0")}:
      {timer.seconds.toString().padStart(2, "0")}
    </Box>
  );
}

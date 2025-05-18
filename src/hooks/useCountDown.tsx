// hooks/useCountdown.ts
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function useCountdown(expireTime?: string) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expireTime) return;

    const tick = () => {
      const now = dayjs();
      const end = dayjs(expireTime);
      const diff = end.diff(now, "second");

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return false;
      }

      const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const seconds = String(diff % 60).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
      return true;
    };

    tick();
    const interval = setInterval(() => {
      const keepGoing = tick();
      if (!keepGoing) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTime]);

  return timeLeft;
}

"use client";

import React, { useState } from 'react';

interface Entry {
  id: number;
  startTime: Date;
  stopTime?: Date;
}

const TimeLogger = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  let intervalId: NodeJS.Timeout | null = null;

  const startLog = () => {
    if (isRunning) return;
    setIsRunning(true);
    setEntries((prevEntries) => [
      ...prevEntries,
      { id: prevEntries.length + 1, startTime: new Date() },
    ]);

    intervalId = setInterval(() => {
      entries.forEach((entry) => {
        if (!entry.stopTime) {
          entry.stopTime = new Date();
        }
      });
      setEntries([...entries]);
    }, 1000);
  };

  const stopLog = () => {
    setIsRunning(false);
    clearInterval(intervalId || undefined);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={startLog}
        disabled={isRunning}
        className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none"
      >
        Start
      </button>
      <button
        onClick={stopLog}
        disabled={!isRunning}
        className="bg-red-500 text-white py-2 px-4 rounded focus:outline-none"
      >
        Stop
      </button>

      <ul className="mt-6 space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="border p-4 rounded">
            Start: {entry.startTime.toLocaleTimeString()}
            {entry.stopTime && (
              <>
                {" "}
                | Stop: {entry.stopTime.toLocaleTimeString()}
                <br />
                Duration:{" "}
                {(entry.stopTime.getTime() - entry.startTime.getTime()) / 1000}s
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeLogger;
"use client";

import React from 'react';
import { Button } from 'shadcn-ui';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Time Logger App</h1>
      <TimeLogger />
    </div>
  );
};

export default Home;
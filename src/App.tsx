import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className='text-2xl font-bold mb-4'>Counter</h1>
      <div className="text-8xl">{count}</div>
      <div className="mt-4 space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setCount(count + 1)}>+</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => setCount(count - 1)}>-</button>
      </div>
      <button className='mt-6 px-4 py-2 bg-green-500 text-white rounded' onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default App;
"use client";
import { BellIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const ComingSoon = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const launchDate = new Date('2025-06-16').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#ffc95c] opacity-10 blur-3xl"></div>
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-emerald-500 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
          {/* Bell icon with animation */}
          <div className="mb-8 animate-bounce rounded-full bg-[#ffc95c] p-4 shadow-lg">
            <BellIcon className="h-8 w-8 text-white" />
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-6xl">
            Something
            <span className="mx-2 bg-gradient-to-r from-[#ffc95c] to-emerald-500 bg-clip-text text-transparent">
              Amazing
            </span>
            is Coming Soon
          </h1>

          {/* Subtitle */}
          <p className="mb-12 max-w-2xl text-lg text-gray-600">
            We&apos;re working hard to bring you something extraordinary. Sign up to be the first to know when we launch.
          </p>

          {/* Countdown timer */}
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Days', value: days },
              { label: 'Hours', value: hours },
              { label: 'Minutes', value: minutes },
              { label: 'Seconds', value: seconds },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-white p-4 shadow-lg">
                <div className="text-3xl font-bold text-[#ffc95c]">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
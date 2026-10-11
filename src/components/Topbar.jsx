import { useState, useEffect } from "react";

export default function Topbar() {
  const [now, setNow] = useState(new Date());

  // Live clock that updates every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit" 
  });
  const date = now.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
  const day = now.toLocaleDateString("en-US", { 
    weekday: "long" 
  });

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-gray-100 bg-white/90 px-6 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
        <span>{time}</span>
        <span className="text-amber-500">·</span>
        <span>{date}</span>
        <span className="text-amber-500">·</span>
        <span>{day}</span>
      </div>
    </header>
  );
}
import { useLocation } from "wouter";

export default function Intro() {
  const [, setLocation] = useLocation();

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => setLocation("/login")}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute bottom-10 right-10">
        <button 
          onClick={() => setLocation("/login")}
          className="text-white/50 hover:text-white border border-white/30 px-4 py-2 rounded-md backdrop-blur-sm transition-all"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
}

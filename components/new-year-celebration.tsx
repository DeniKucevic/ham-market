"use client";

import { useEffect, useState } from "react";

interface ConfettiItem {
  left: number;
  delay: number;
  duration: number;
  color: string;
}

interface FireworkParticle {
  angle: number;
  color: string;
}

interface FireworkItem {
  left: number;
  top: number;
  delay: number;
  particles: FireworkParticle[];
}

const generateConfetti = (): ConfettiItem[] => {
  const colors = ["#ff0080", "#00ff80", "#0080ff", "#ffff00", "#ff00ff"];
  return Array.from({ length: 50 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * 5)],
  }));
};

const generateFireworks = (): FireworkItem[] => {
  const colors = [
    "#ff0080",
    "#00ff80",
    "#0080ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  return Array.from({ length: 8 }, (_, i) => ({
    left: 20 + Math.random() * 60,
    top: 20 + Math.random() * 40,
    delay: i * 0.8,
    particles: Array.from({ length: 12 }, (_, j) => ({
      angle: j * 30,
      color: colors[Math.floor(Math.random() * 6)],
    })),
  }));
};

export function NewYearCelebration() {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [isNewYear, setIsNewYear] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const [confettiData] = useState<ConfettiItem[]>(generateConfetti);
  const [fireworksData] = useState<FireworkItem[]>(generateFireworks);

  useEffect(() => {
    interface WindowWithNewYear extends Window {
      testNewYear?: () => void;
      testCountdown?: () => void;
      hideNewYear?: () => void;
    }

    const customWindow = window as WindowWithNewYear;

    customWindow.testNewYear = () => {
      setForceShow(true);
      setShow(true);
      setIsNewYear(true);
      setShowFireworks(true);
      setDismissed(false);
      console.log("🎉 New Year mode activated! Type hideNewYear() to disable.");
    };

    customWindow.testCountdown = () => {
      setForceShow(true);
      setShow(true);
      setIsNewYear(false);
      setShowFireworks(false);
      setDismissed(false);
      setCountdown("0h 15m 30s");
      console.log(
        "⏰ Countdown mode activated! Type hideNewYear() to disable."
      );
    };

    customWindow.hideNewYear = () => {
      setForceShow(false);
      setShow(false);
      setShowFireworks(false);
      setDismissed(true);
      console.log("👋 Hidden");
    };

    const checkDate = () => {
      if (forceShow) return;

      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();

      if ((month === 11 && day === 31) || (month === 0 && day === 1)) {
        setShow(true);

        const newYear = new Date(
          now.getFullYear() + (month === 11 ? 1 : 0),
          0,
          1
        );
        const diff = newYear.getTime() - now.getTime();

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
          setIsNewYear(false);
          setShowFireworks(false);
        } else {
          setIsNewYear(true);
          setShowFireworks(true);
        }
      } else {
        setShow(false);
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 1000);

    return () => clearInterval(interval);
  }, [forceShow]);

  if (!show || dismissed) return null;

  return (
    <>
      {/* Bottom banner */}
      <div
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 }}
      >
        {isNewYear ? (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-2 shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <div className="text-2xl animate-pulse">🎉🎊✨</div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-white">
                      Happy New Year 2026!
                    </span>
                    <span className="text-sm text-white/90 font-semibold ml-2">
                      73 de YU4AIE!
                    </span>
                  </div>
                  <div className="text-2xl animate-pulse">🎉🎊✨</div>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-white/80 hover:text-white p-1"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 justify-center text-white">
                  <div className="text-xl">🎆</div>
                  <span className="text-sm font-semibold">New Year in: </span>
                  <span className="font-mono text-base font-bold">
                    {countdown}
                  </span>
                  <div className="text-xl">🎆</div>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-white/80 hover:text-white p-1"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fireworks and Confetti */}
      {showFireworks && (
        <>
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {confettiData.map((confetti, i) => (
              <div
                key={`confetti-${i}`}
                className="confetti"
                style={{
                  left: `${confetti.left}%`,
                  animationDelay: `${confetti.delay}s`,
                  animationDuration: `${confetti.duration}s`,
                  backgroundColor: confetti.color,
                }}
              />
            ))}
          </div>

          {/* Fireworks */}
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {fireworksData.map((firework, i) => (
              <div
                key={`firework-${i}`}
                className="firework-container"
                style={{
                  left: `${firework.left}%`,
                  top: `${firework.top}%`,
                  animationDelay: `${firework.delay}s`,
                }}
              >
                {firework.particles.map((particle, j) => (
                  <div
                    key={`particle-${j}`}
                    className="firework-particle"
                    style={
                      {
                        "--angle": `${particle.angle}deg`,
                        "--color": particle.color,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Styles */}
          <style jsx global>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
              }
            }

            .confetti {
              position: absolute;
              width: 10px;
              height: 10px;
              animation: confetti-fall linear infinite;
            }

            @keyframes firework-burst {
              0% {
                transform: translate(0, 0) scale(0);
                opacity: 1;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: translate(
                    calc(cos(var(--angle)) * 150px),
                    calc(sin(var(--angle)) * 150px)
                  )
                  scale(1);
                opacity: 0;
              }
            }

            .firework-container {
              position: absolute;
              animation: firework-launch 4s ease-out infinite;
            }

            @keyframes firework-launch {
              0% {
                opacity: 0;
                transform: translateY(200px);
              }
              5% {
                opacity: 1;
                transform: translateY(0);
              }
              100% {
                opacity: 0;
                transform: translateY(0);
              }
            }

            .firework-particle {
              position: absolute;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: var(--color);
              box-shadow: 0 0 10px var(--color), 0 0 20px var(--color),
                0 0 30px var(--color);
              animation: firework-burst 1.2s ease-out infinite;
              animation-delay: 0.3s;
            }
          `}</style>
        </>
      )}
    </>
  );
}

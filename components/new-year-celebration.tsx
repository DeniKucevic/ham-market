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
    delay: i * 0.8, // Stagger them more
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
      console.log("🎉 New Year mode activated! Type hideNewYear() to disable.");
    };

    customWindow.testCountdown = () => {
      setForceShow(true);
      setShow(true);
      setIsNewYear(false);
      setShowFireworks(false);
      setCountdown("0h 15m 30s");
      console.log(
        "⏰ Countdown mode activated! Type hideNewYear() to disable."
      );
    };

    customWindow.hideNewYear = () => {
      setForceShow(false);
      setShow(false);
      setShowFireworks(false);
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

  useEffect(() => {
    if (isNewYear) {
      document.body.classList.add("new-year-celebration");
    } else {
      document.body.classList.remove("new-year-celebration");
    }

    return () => {
      document.body.classList.remove("new-year-celebration");
    };
  }, [isNewYear]);

  if (!show) return null;

  return (
    <>
      {/* Main celebration widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {isNewYear ? (
          <div className="animate-bounce rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-6 shadow-2xl">
            <div className="text-center">
              <div className="mb-2 text-5xl animate-pulse">🎉🎊✨</div>
              <div className="text-2xl font-bold text-white mb-1">
                Happy New Year 2026!
              </div>
              <div className="text-base text-white/90 font-semibold">
                73 de YU4AIE!
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-2xl">
            <div className="text-center">
              <div className="mb-1 text-2xl">🎆</div>
              <div className="text-sm font-semibold text-white">
                New Year in:
              </div>
              <div className="font-mono text-lg font-bold text-white">
                {countdown}
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

            body.new-year-celebration {
              animation: celebration-glow 2s ease-in-out infinite;
            }

            @keyframes celebration-glow {
              0%,
              100% {
                filter: brightness(1);
              }
              50% {
                filter: brightness(1.1);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}

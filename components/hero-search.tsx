"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  initialQuery?: string;
}

const POPULAR_SEARCHES = [
  "FT-991A",
  "IC-7300",
  "Yaesu",
  "HF Antenna",
  "Power Supply",
  "Kenwood",
];

export function HeroSearch({ initialQuery = "" }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`, {
        scroll: false,
      });
    } else {
      router.push("/", { scroll: false });
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/", { scroll: false });
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    router.push(`/?search=${encodeURIComponent(term)}`, { scroll: false });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
      {/* Parallax Background Image */}
      <div
        className="absolute opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/ham-hero-bg.webp')",
          transform: `translate3d(0, ${scrollY * 0.5}px, 0) scale(1.2)`,
          inset: "-20%",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      />
      ƒ{/* Black overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            HAM Radio Marketplace
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-blue-100">
            Buy and sell amateur radio equipment with fellow operators
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for radios, antennas, accessories..."
                  className="block w-full rounded-lg border-0 py-4 pl-12 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg
                      className="h-5 w-5"
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
                )}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-white px-8 py-4 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </form>

          {/* Show active search or popular searches */}
          {query ? (
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 dark:bg-blue-900">
                <span className="text-sm text-blue-100">Searching for:</span>
                <span className="font-medium text-white">{query}</span>
                <button
                  onClick={handleClear}
                  className="ml-1 text-blue-200 hover:text-white"
                >
                  <svg
                    className="h-4 w-4"
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
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-blue-200">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularClick(term)}
                  className="rounded-full bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

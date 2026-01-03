import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found | HAM Marketplace",
  description: "The page you're looking for could not be found.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "404 - Page Not Found",
    description: "Signal Lost - The page you're looking for is off the air",
    siteName: "HAM Marketplace",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "404 - Page Not Found",
    description: "Signal Lost - The page you're looking for is off the air",
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="text-center">
        {/* Radio Tower Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Tower */}
            <div className="h-32 w-2 bg-gray-600"></div>
            {/* Animated Signal Waves */}
            <div className="absolute left-1/2 top-8 -translate-x-1/2">
              <div className="absolute h-16 w-16 animate-ping rounded-full bg-red-500 opacity-75"></div>
              <div className="animation-delay-500 absolute h-16 w-16 animate-ping rounded-full bg-red-500 opacity-50"></div>
              <div className="animation-delay-1000 absolute h-16 w-16 animate-ping rounded-full bg-red-500 opacity-25"></div>
            </div>
          </div>
        </div>

        {/* Error Code in Morse-like style */}
        <div className="mb-6 font-mono text-6xl font-bold text-red-500">
          <span className="animate-pulse">• • • •</span>{" "}
          <span className="text-white">404</span>{" "}
          <span className="animate-pulse">• • • •</span>
        </div>

        <h1 className="text-4xl font-bold text-white">Signal Lost</h1>

        <p className="mt-4 font-mono text-lg text-gray-400">
          CQ CQ CQ... No response from this frequency
        </p>

        <p className="mt-2 text-gray-500">
          {"The page you're looking for is off the air"}
        </p>

        {/* Radio Panel Style Button */}
        <div className="mt-12">
          <Link
            href="/en"
            className="group relative inline-block overflow-hidden rounded-lg border-2 border-blue-500 bg-blue-600 px-12 py-4 font-mono text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <span className="relative z-10">Return to Base Station</span>
          </Link>
        </div>

        {/* Frequency Display */}
        <div className="mt-12 rounded-lg border border-gray-700 bg-black/50 p-4 font-mono text-sm text-green-400">
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-500">●</span>
            <span>ERROR 404 MHz</span>
            <span className="animate-pulse text-yellow-500">|</span>
            <span className="text-gray-600">CARRIER LOST</span>
          </div>
        </div>
      </div>
    </div>
  );
}

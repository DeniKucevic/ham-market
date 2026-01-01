"use client";

import { useState } from "react";

interface PhoneContactProps {
  phone: string;
}

export function PhoneContact({ phone }: PhoneContactProps) {
  const [copied, setCopied] = useState(false);
  const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits

  const handleCopy = () => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {/* Phone number with copy */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {phone}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-md px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Action buttons */}
      <a
        href={`tel:${phone}`}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        Call
      </a>

      <a
        href={`https://wa.me/${cleanPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg
          className="h-5 w-5 text-green-600 dark:text-green-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        WhatsApp
      </a>

      <a
        href={`viber://chat?number=${cleanPhone}`}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg
          className="h-5 w-5 text-purple-600 dark:text-purple-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.4 0C9.473.028 5.333.344 2.866 2.901 1.26 4.505.693 6.48.623 8.753c-.06 2.27-.06 6.87 6.815 8.14v3.695l.05.044c.348.443.735.443 1.166.003.082-.078.255-.2.944-.788.623-.528 1.056-.92 1.315-1.135 3.186.255 5.632-.347 5.92-.447.676-.226 4.505-.746 5.14-6.048.656-5.48-.307-8.98-2.567-10.534C17.742.438 14.213.006 11.4.001zm.005 1.677c2.45.007 5.55.385 7.453 1.681 1.815 1.184 2.5 3.97 1.96 8.66-.532 4.71-3.796 5.008-4.397 5.18-.252.073-2.52.642-5.27.4-.146.002-.618.456-1.748 1.468-.508.457-.904.8-1.165 1.024v-3.622c-6.694-1.002-5.736-6.109-5.694-7.877.037-1.93.5-3.416 1.865-4.835C6.715 1.238 9.918 1.11 11.405 1.11zm5.707 6.598c-.3 0-.544.243-.544.543v.814c0 .3.244.544.544.544.3 0 .543-.244.543-.544v-.814c0-.3-.243-.543-.543-.543zm-2.173 0c-.3 0-.543.243-.543.543v.814c0 .3.243.544.543.544.3 0 .544-.244.544-.544v-.814c0-.3-.244-.543-.544-.543zm-2.173 0c-.3 0-.544.243-.544.543v.814c0 .3.244.544.544.544.3 0 .543-.244.543-.544v-.814c0-.3-.243-.543-.543-.543zm-2.172 0c-.3 0-.544.243-.544.543v.814c0 .3.244.544.544.544.3 0 .543-.244.543-.544v-.814c0-.3-.243-.543-.543-.543zm-2.174 0c-.3 0-.543.243-.543.543v.814c0 .3.243.544.543.544.3 0 .544-.244.544-.544v-.814c0-.3-.244-.543-.544-.543z" />
        </svg>
        Viber
      </a>
    </div>
  );
}

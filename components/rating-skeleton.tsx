export function RatingSkeleton() {
  return (
    <div className="animate-pulse border-b border-gray-200 pb-6 last:border-b-0 dark:border-gray-700">
      {/* Stars skeleton */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>

      {/* Listing title skeleton */}
      <div className="mt-2 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Comment skeleton */}
      <div className="mt-2 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Author & date skeleton */}
      <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export function ListingGridSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      {/* Image skeleton */}
      <div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="p-4">
        <div className="h-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export function ListingListSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      {/* Image skeleton */}
      <div className="h-32 w-32 flex-shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

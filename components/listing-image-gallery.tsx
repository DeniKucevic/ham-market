"use client";

import { useState } from "react";

interface Props {
  images: string[];
  title: string;
}

export function ListingImageGallery({ images, title }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      {/* Main Image - Clickable */}
      <div
        className="relative mb-4 h-96 cursor-pointer overflow-hidden rounded-lg bg-white dark:bg-gray-800"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={images[selectedImage]}
          alt={title}
          className="h-full w-full object-contain transition-transform hover:scale-105"
        />
        {/* Zoom icon hint */}
        <div className="absolute right-4 top-4 rounded-full bg-black/50 p-2">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </div>
      </div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-20 w-full overflow-hidden rounded-lg ${
                selectedImage === index
                  ? "ring-2 ring-blue-500"
                  : "hover:opacity-75"
              }`}
            >
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg
              className="h-6 w-6"
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

          {/* Previous button */}
          {images.length > 1 && selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Full size image */}
          <div
            className="relative h-[90vh] w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Next button */}
          {images.length > 1 && selectedImage < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

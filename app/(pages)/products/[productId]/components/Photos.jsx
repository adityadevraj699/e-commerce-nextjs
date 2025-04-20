"use client";

import { useState } from "react";

export default function Photos({ imageList = [] }) {
  // Guard clause for empty image list
  if (!imageList.length) return null;

  const [selectedImage, setSelectedImage] = useState(imageList[0]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main Selected Image */}
      <div className="flex justify-center w-full">
        <img
          className="object-cover h-[350px] md:h-[430px] rounded-lg shadow-lg"
          src={selectedImage}
          alt="Selected Preview"
        />
      </div>

      {/* Thumbnail List */}
      <div className="flex flex-wrap justify-center items-center gap-3">
        {imageList.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(item)}
            className={`w-[80px] border rounded p-1 cursor-pointer hover:scale-105 transition-transform ${
              selectedImage === item ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <img
              className="object-cover h-[70px] w-[70px] rounded"
              src={item}
              alt={`Thumbnail ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

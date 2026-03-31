import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse group box-border overflow-hidden flex rounded-md shadow-sm flex-col items-center bg-white p-4">
      <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
      <div className="w-full">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
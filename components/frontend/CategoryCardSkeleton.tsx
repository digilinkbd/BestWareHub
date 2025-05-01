import React from 'react';

const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="relative h-[190px] rounded-lg overflow-hidden shadow-sm bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-transparent to-transparent">
        <div className="absolute -bottom-1 left-0 right-0 p-4 text-center">
          <div className="h-6 w-28 bg-gray-300 rounded mx-auto mb-2"></div>
          <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 shrink-0"></div>

            {/* Content Skeleton */}
            <div className="p-3 flex flex-col flex-1">
                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

                {/* Price */}
                <div className="mb-3">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded col-span-2 w-2/3 mt-1"></div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;

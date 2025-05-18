import React from "react";

const SkeletonInput = () => (
  <div className="w-full h-10 bg-custom-gray-200 animate-pulse rounded-md" />
);

const RegisterFormSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-4 w-24 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div>
        <div className="h-4 w-24 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div>
        <div className="h-4 w-20 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div>
        <div className="h-4 w-28 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div>
        <div className="h-4 w-40 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div>
        <div className="h-4 w-48 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div>
        <div className="h-4 w-60 bg-custom-gray-300 mb-2 rounded" />
        <SkeletonInput />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-4 w-4 bg-custom-gray-300 rounded" />
        <div className="h-4 w-52 bg-custom-gray-300 rounded" />
      </div>

      <div className="space-y-2">
        <div className="h-10 bg-custom-golden-200 rounded-md" />
        <div className="h-10 bg-custom-gray-300 rounded-md" />
      </div>
    </div>
  );
};

export default RegisterFormSkeleton;

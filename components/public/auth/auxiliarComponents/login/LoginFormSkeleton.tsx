import React from "react";

const LoginFormSkeleton = () => {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Email Input */}
            <div>
                <div className="block text-sm font-medium text-custom-gray-800 mb-1 bg-custom-gray-300 h-4 w-32 rounded-md"></div>
                <div className="relative">
                    <div className="absolute left-3 top-3 h-5 w-5 bg-custom-gray-300 rounded-md"></div>
                    <div className="block w-full pl-10 pr-3 py-2 bg-custom-gray-300 h-10 rounded-md shadow-sm"></div>
                </div>
            </div>

            {/* Password Input */}
            <div>
                <div className="block text-sm font-medium text-custom-gray-800 mb-1 bg-custom-gray-300 h-4 w-32 rounded-md"></div>
                <div className="relative">
                    <div className="absolute left-3 top-3 h-5 w-5 bg-custom-gray-300 rounded-md"></div>
                    <div className="block w-full pl-10 pr-3 py-2 bg-custom-gray-300 h-10 rounded-md shadow-sm"></div>
                </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-sm bg-custom-gray-300 h-4 w-48 rounded-md"></div>

            {/* Login Button */}
            <div>
                <div className="w-full flex justify-center py-2 px-4 bg-custom-gray-300 h-10 rounded-md shadow-sm"></div>
            </div>
        </div>
    );
};

export default LoginFormSkeleton;

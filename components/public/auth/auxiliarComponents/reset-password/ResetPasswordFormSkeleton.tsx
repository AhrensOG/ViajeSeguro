import React from "react";

const ResetPasswordFormSkeleton = () => {
    return (
        <div className="mx-auto mt-10 bg-white animate-pulse">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-first-gray mb-4 bg-fourth-gray h-6 w-4/5 mx-auto rounded-md"></h2>
            {/* Description */}
            <p className="text-sm text-center text-second-gray mb-6 bg-fourth-gray h-4 w-3/4 mx-auto rounded-md"></p>

            <div className="space-y-4">
                {/* New Password */}
                <div>
                    <div className="block text-sm font-medium text-first-gray mb-1 bg-fourth-gray h-4 w-32 rounded-md"></div>
                    <div className="relative">
                        <div className="absolute left-3 top-3 h-5 w-5 bg-fourth-gray rounded-md"></div>
                        <div className="block w-full pl-10 pr-3 py-2 bg-fourth-gray h-10 rounded-md shadow-sm"></div>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <div className="block text-sm font-medium text-first-gray mb-1 bg-fourth-gray h-4 w-40 rounded-md"></div>
                    <div className="relative">
                        <div className="absolute left-3 top-3 h-5 w-5 bg-fourth-gray rounded-md"></div>
                        <div className="block w-full pl-10 pr-3 py-2 bg-fourth-gray h-10 rounded-md shadow-sm"></div>
                    </div>
                </div>

                {/* Reset Password Button */}
                <div>
                    <div className="w-full flex justify-center py-2 px-4 bg-fourth-gray h-10 rounded-md shadow-sm"></div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordFormSkeleton;

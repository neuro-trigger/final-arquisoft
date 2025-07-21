export default function RegisterLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-8 w-72 bg-gray-200 rounded mx-auto"></div>
                <div className="h-4 w-56 bg-gray-200 rounded mx-auto mt-2"></div>
            </div>

            <div className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>
                        <div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="ml-2 h-4 w-64 bg-gray-200 rounded"></div>
                </div>

                {/* Submit Button */}
                <div>
                    <div className="h-10 w-full bg-gray-200 rounded-md"></div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                    <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
                </div>
            </div>
        </div>
    );
}

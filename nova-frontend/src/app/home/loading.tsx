const DashboardLoading = () => {
    return (
        <div className="container mx-auto px-4 py-6 animate-pulse">
            {/* Balance Overview Skeleton */}
            <section className="mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                            <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Skeleton */}
            <section className="mb-8">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pockets Section Skeleton */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full mb-3"></div>
                            <div className="flex justify-between items-center">
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Transactions Skeleton */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Savings Section Skeleton */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardLoading;

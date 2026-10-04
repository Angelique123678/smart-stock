// Trade Table Loader Component

export const renderTradeTableLoader = () => {
    return (
      <div className="overflow-x-auto hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="px-2 py-4 whitespace-nowrap">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse mr-3"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

    // Trade Card Skeleton Loader
    const TradeCardSkeleton = () => {
        return (
          <div className="flex flex-col p-5 gap-1 rounded-md border border-gray-200 bg-gray-50 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex mt-1">
              <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        );
      };
      
      // Trade Cards Loading Component
      export const TradeCardsLoading = () => {
        return (
          <div className="flex flex-col p-1 gap-3 lg:hidden w-full">
            {[...Array(3)].map((_, index) => (
              <TradeCardSkeleton key={index} />
            ))}
          </div>
        );
      };
      
    
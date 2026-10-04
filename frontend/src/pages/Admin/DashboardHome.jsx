import React from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts';
const DashbaordHome = () => {
    
  // Sample data for the chart
  const visitorData = [
    { date: 'Jun 1', visitors1: 80, visitors2: 40 },
    { date: 'Jun 3', visitors1: 120, visitors2: 60 },
    { date: 'Jun 5', visitors1: 70, visitors2: 50 },
    { date: 'Jun 7', visitors1: 140, visitors2: 80 },
    { date: 'Jun 9', visitors1: 60, visitors2: 40 },
    { date: 'Jun 11', visitors1: 100, visitors2: 60 },
    { date: 'Jun 13', visitors1: 80, visitors2: 50 },
    { date: 'Jun 15', visitors1: 160, visitors2: 90 },
    { date: 'Jun 17', visitors1: 120, visitors2: 70 },
    { date: 'Jun 19', visitors1: 90, visitors2: 60 },
    { date: 'Jun 21', visitors1: 150, visitors2: 80 },
    { date: 'Jun 23', visitors1: 100, visitors2: 70 },
    { date: 'Jun 25', visitors1: 140, visitors2: 80 },
    { date: 'Jun 27', visitors1: 120, visitors2: 70 },
    { date: 'Jun 30', visitors1: 130, visitors2: 80 },
  ];
  return (
   <>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium text-gray-500">Total Items in stock</div>
                  <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded">
                    <span>+12.5%</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">20,200</div>
                <div className="flex items-center text-green-600 text-xs">
                  <span>Trending up this month</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div className="text-gray-500 text-xs">Visitors for the last 6 months</div>
              </div>

              {/* New Customers */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium text-gray-500">Weekly Requests</div>
                  <div className="flex items-center text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded">
                    <span>-20%</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">20</div>
                <div className="flex items-center text-red-600 text-xs">
                  <span>Down 20% this period</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                  </svg>
                </div>
                <div className="text-gray-500 text-xs">Acquisition needs attention</div>
              </div>

              {/* Active Accounts */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium text-gray-500">Total Teachers</div>
                  <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded">
                    <span>+12.5%</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="flex items-center text-green-600 text-xs">
                  <span>Strong user retention</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div className="text-gray-500 text-xs">Engagement exceed targets</div>
              </div>

              {/* Growth Rate */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-medium text-gray-500">Approved requests with percentage</div>
                  <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded">
                    <span>+4.5%</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">4.5%</div>
                <div className="flex items-center text-green-600 text-xs">
                  <span>Steady performance</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div className="text-gray-500 text-xs">Meets growth projections</div>
              </div>
            </div>

            {/* Chart section */}
            <div className="mt-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="font-medium">Total Visitors</div>
                    <div className="text-sm text-gray-500">Total for the last 3 months</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200">Last 3 months</button>
                    <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-200 hover:bg-gray-100">Last 30 days</button>
                    <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-200 hover:bg-gray-100">Last 7 days</button>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitorData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisitors1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorVisitors2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                      <Area
                        type="monotone"
                        dataKey="visitors1"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVisitors1)"
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors2"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorVisitors2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
   
   </>
  )
}

export default DashbaordHome
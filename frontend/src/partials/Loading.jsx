import React, { useEffect, useState } from 'react';
import { BarChart3, LineChart, DollarSign, TrendingUp } from 'lucide-react';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Connecting to markets');
  
  useEffect(() => {
    const loadingMessages = [
      'Connecting to markets',
      'Fetching latest stock data',
      'Loading market indicators',
      'Analyzing trends',
      'Preparing your dashboard'
    ];
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 150);
    
    // Update loading message
    const messageInterval = setInterval(() => {
      const messageIndex = Math.floor((progress / 100) * loadingMessages.length);
      setLoadingText(loadingMessages[Math.min(messageIndex, loadingMessages.length - 1)]);
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [progress]);
  
  return (
    <div className="h-screen w-full fixed top-0 left-0 z-[10000] bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md px-4 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex items-center">
          <div className="bg-blue-500 p-3 rounded-lg">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold ml-3">SmartStock</h1>
        </div>
        
        {/* Loading animation */}
        <div className="w-full mb-8 flex justify-center">
          <div className="flex space-x-8 items-center">
            <DollarSign className={`w-8 h-8 animate-bounce ${progress < 30 ? 'text-blue-300' : 'text-blue-500'}`} style={{ animationDelay: '0ms' }} />
            <BarChart3 className={`w-8 h-8 animate-bounce ${progress < 60 ? 'text-blue-300' : 'text-blue-500'}`} style={{ animationDelay: '200ms' }} />
            <LineChart className={`w-8 h-8 animate-bounce ${progress < 90 ? 'text-blue-300' : 'text-blue-500'}`} style={{ animationDelay: '400ms' }} />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-blue-800 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-400 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Loading text */}
        <p className="text-blue-200 text-sm">{loadingText}...</p>
        
        {/* Progress percentage */}
        <p className="mt-2 text-sm font-medium">{progress}%</p>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-center text-xs text-blue-300 px-4">
        <p>Preparing real-time market analysis and intelligent insights</p>
        <p className="mt-2 text-blue-400">© 2025 SmartStock Financial Technology</p>
      </div>
    </div>
  );
};

export default LoadingPage;
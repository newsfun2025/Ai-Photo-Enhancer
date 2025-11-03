import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.45 2.9-3.2.47 2.3 2.24-.55 3.18L12 10.3l2.9 1.5-1.15 3.45-2.9-1.5-3.2.47-1.45 2.9M21 12l-1.45-2.9-3.2-.47 2.3-2.24-.55-3.18L15.1 5.7l-1.15-3.45-1.45 2.9-3.2.47 2.3 2.24-.55 3.18L12 10.3l2.9 1.5-1.15 3.45-2.9-1.5-3.2.47-1.45 2.9M3 12l1.45-2.9 3.2-.47-2.3-2.24.55-3.18L8.9 5.7l1.15-3.45L8.6 5.15l-3.2-.47-1.45-2.9"/></svg>
                <span className="text-xl font-bold text-slate-200">Photo Enhancer AI</span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
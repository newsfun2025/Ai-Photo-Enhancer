import React, { useState } from 'react';
import { Mode } from './types';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ImageStudio from './components/ImageStudio';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.Colorize);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
          AI Photo Enhancer
        </h1>
        <p className="text-lg text-slate-400 text-center mb-8 max-w-2xl">
          Breathe new life into your photos. Colorize black and white images or remove backgrounds with the power of Gemini.
        </p>

        <ModeSelector currentMode={mode} onModeChange={setMode} />
        <div className="w-full max-w-4xl mt-8">
          <ImageStudio 
            key={mode} 
            mode={mode}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
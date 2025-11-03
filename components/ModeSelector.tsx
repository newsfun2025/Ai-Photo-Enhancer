
import React from 'react';
import { Mode } from '../types';

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: Mode.Colorize, label: 'Colorize Photo' },
    { id: Mode.RemoveBackground, label: 'Remove Background' },
  ];

  return (
    <div className="flex bg-slate-800 rounded-full p-1 shadow-inner">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500
            ${
              currentMode === mode.id
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-700'
            }
          `}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;

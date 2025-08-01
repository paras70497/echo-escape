
import React from 'react';
import { MAX_NOISE } from '../constants';

interface NoiseMeterProps {
  level: number;
}

export const NoiseMeter: React.FC<NoiseMeterProps> = ({ level }) => {
  const percentage = (level / MAX_NOISE) * 100;
  
  let colorClass = 'bg-green-500';
  if (percentage > 75) {
    colorClass = 'bg-red-500';
  } else if (percentage > 40) {
    colorClass = 'bg-yellow-500';
  }

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 my-4 shadow-inner">
      <div
        className={`h-4 rounded-full transition-all duration-300 ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

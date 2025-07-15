"use client";

import React from 'react';

// Props: 'percentage' to procent do wyświetlenia
interface DonutChartProps {
    percentage: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    // Obliczamy, jak duża część okręgu ma być "zakreskowana"
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                {/* Tło kółka */}
                <circle
                    className="text-primary/10"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                {/* Warstwa postępu */}
                <circle
                    className="text-primary -rotate-90 origin-center"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
            </svg>
            {/* Tekst w środku */}
            <span className="absolute text-2xl font-bold text-primary">
        {percentage}%
      </span>
        </div>
    );
};

export default DonutChart;
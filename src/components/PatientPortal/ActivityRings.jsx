import React from 'react';

const ActivityRings = ({ moveData, exerciseData, standData }) => {
    const { current: moveCurrent = 0, goal: moveGoal = 600 } = moveData || {};
    const { current: exerciseCurrent = 0, goal: exerciseGoal = 30 } = exerciseData || {};
    const { current: standCurrent = 0, goal: standGoal = 12 } = standData || {};

    const movePercentage = Math.min((moveCurrent / moveGoal) * 100, 100);
    const exercisePercentage = Math.min((exerciseCurrent / exerciseGoal) * 100, 100);
    const standPercentage = Math.min((standCurrent / standGoal) * 100, 100);

    const createRingPath = (percentage, radius) => {
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        return { circumference, offset };
    };

    const moveRing = createRingPath(movePercentage, 70);
    const exerciseRing = createRingPath(exercisePercentage, 55);
    const standRing = createRingPath(standPercentage, 40);

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl">
            <h3 className="text-white text-2xl font-bold mb-6">Activity Rings</h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="relative w-56 h-56">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="moveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FF00FF" />
                                <stop offset="100%" stopColor="#FF0080" />
                            </linearGradient>
                            <linearGradient id="exerciseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#7FFF00" />
                                <stop offset="100%" stopColor="#00FF00" />
                            </linearGradient>
                            <linearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00FFFF" />
                                <stop offset="100%" stopColor="#0080FF" />
                            </linearGradient>
                        </defs>

                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="12"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="url(#moveGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={moveRing.circumference}
                            strokeDashoffset={moveRing.offset}
                            className="transition-all duration-1000 ease-out"
                        />

                        <circle
                            cx="80"
                            cy="80"
                            r="55"
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="12"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="55"
                            fill="none"
                            stroke="url(#exerciseGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={exerciseRing.circumference}
                            strokeDashoffset={exerciseRing.offset}
                            className="transition-all duration-1000 ease-out delay-200"
                        />

                        <circle
                            cx="80"
                            cy="80"
                            r="40"
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="12"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="40"
                            fill="none"
                            stroke="url(#standGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={standRing.circumference}
                            strokeDashoffset={standRing.offset}
                            className="transition-all duration-1000 ease-out delay-400"
                        />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-white text-4xl font-bold">
                                {Math.round(((movePercentage + exercisePercentage + standPercentage) / 3))}%
                            </div>
                            <div className="text-gray-400 text-sm mt-1">Complete</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full lg:w-auto">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"></div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-white text-2xl font-bold">{Math.round(moveCurrent)}</span>
                                    <span className="text-gray-400 text-sm">/ {moveGoal} CAL</span>
                                </div>
                                <div className="text-gray-400 text-sm font-medium">Move</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-xl font-bold">{Math.round(movePercentage)}%</div>
                            </div>
                        </div>
                        <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-1000"
                                style={{ width: `${movePercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-white text-2xl font-bold">{Math.round(exerciseCurrent)}</span>
                                    <span className="text-gray-400 text-sm">/ {exerciseGoal} MIN</span>
                                </div>
                                <div className="text-gray-400 text-sm font-medium">Exercise</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-xl font-bold">{Math.round(exercisePercentage)}%</div>
                            </div>
                        </div>
                        <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 delay-200"
                                style={{ width: `${exercisePercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-white text-2xl font-bold">{Math.round(standCurrent)}</span>
                                    <span className="text-gray-400 text-sm">/ {standGoal} HRS</span>
                                </div>
                                <div className="text-gray-400 text-sm font-medium">Stand</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-xl font-bold">{Math.round(standPercentage)}%</div>
                            </div>
                        </div>
                        <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 delay-400"
                                style={{ width: `${standPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityRings;

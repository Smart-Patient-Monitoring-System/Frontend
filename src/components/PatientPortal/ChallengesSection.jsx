import React from 'react';
import { Target, Trophy, Flame, Zap, Award, Clock, Calendar } from 'lucide-react';

const ChallengesSection = ({ dailyChallenges = [], weeklyChallenges = [] }) => {
    const defaultDailyChallenges = dailyChallenges.length > 0 ? dailyChallenges : [
        {
            id: 1,
            title: '10,000 Steps',
            description: 'Walk 10,000 steps today',
            current: 7420,
            target: 10000,
            unit: 'steps',
            icon: Target,
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-500'
        },
        {
            id: 2,
            title: 'Active Calories',
            description: 'Burn 600 active calories',
            current: 450,
            target: 600,
            unit: 'cal',
            icon: Flame,
            color: 'from-orange-500 to-red-500',
            iconBg: 'bg-orange-500'
        },
        {
            id: 3,
            title: 'Exercise Minutes',
            description: 'Complete 30 minutes of exercise',
            current: 18,
            target: 30,
            unit: 'min',
            icon: Zap,
            color: 'from-green-500 to-green-600',
            iconBg: 'bg-green-500'
        },
        {
            id: 4,
            title: 'SPO2 Check',
            description: 'Measure your blood oxygen level',
            current: 1,
            target: 1,
            unit: 'check',
            icon: Award,
            color: 'from-teal-500 to-cyan-500',
            iconBg: 'bg-teal-500'
        }
    ];

    const defaultWeeklyChallenges = weeklyChallenges.length > 0 ? weeklyChallenges : [
        {
            id: 1,
            title: 'Weekly Warrior',
            description: 'Close all rings 5 days this week',
            current: 3,
            target: 5,
            unit: 'days',
            icon: Trophy,
            color: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-500',
            daysLeft: 4
        },
        {
            id: 2,
            title: 'Distance Master',
            description: 'Walk or run 30km this week',
            current: 18.5,
            target: 30,
            unit: 'km',
            icon: Target,
            color: 'from-indigo-500 to-blue-500',
            iconBg: 'bg-indigo-500',
            daysLeft: 4
        },
        {
            id: 3,
            title: 'Workout Streak',
            description: 'Complete a workout for 4 days',
            current: 2,
            target: 4,
            unit: 'workouts',
            icon: Flame,
            color: 'from-red-500 to-orange-500',
            iconBg: 'bg-red-500',
            daysLeft: 4
        }
    ];

    const renderChallengeCard = (challenge, isWeekly = false) => {
        const Icon = challenge.icon;
        const percentage = Math.min((challenge.current / challenge.target) * 100, 100);
        const isCompleted = challenge.current >= challenge.target;

        return (
            <div
                key={challenge.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 relative"
            >
                {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-50 rounded-full p-1.5">
                        <Trophy className="w-4 h-4 text-green-600" />
                    </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                    <div className={`${challenge.iconBg} p-2.5 rounded-xl`}>
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold text-base mb-0.5">{challenge.title}</h4>
                        <p className="text-gray-500 text-xs">{challenge.description}</p>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-gray-900 text-2xl font-bold">{challenge.current.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs">/ {challenge.target.toLocaleString()} {challenge.unit}</span>
                    </div>

                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-gray-600 text-xs">
                    <span className="font-medium">{Math.round(percentage)}% Complete</span>
                    {isWeekly && challenge.daysLeft !== undefined && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{challenge.daysLeft} days left</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-gray-100 p-2.5 rounded-xl">
                        <Zap className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Daily Challenges</h3>
                        <p className="text-gray-500 text-sm">Complete your goals for today</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {defaultDailyChallenges.map(challenge => renderChallengeCard(challenge, false))}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-gray-100 p-2.5 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Weekly Challenges</h3>
                        <p className="text-gray-500 text-sm">Long-term goals to achieve this week</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {defaultWeeklyChallenges.map(challenge => renderChallengeCard(challenge, true))}
                </div>
            </div>
        </div>
    );
};

export default ChallengesSection;

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HealthMetricCard = ({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    trendValue,
    bgGradient,
    iconBg,
    chartData = [],
    subtitle
}) => {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-500';
        if (trend === 'down') return 'text-red-500';
        return 'text-gray-500';
    };

    const maxChartValue = Math.max(...chartData.map(d => d.value || 0), 1);

    return (
        <div className={`${bgGradient} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`${iconBg} p-3 rounded-2xl shadow-md`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                {trendValue && (
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md ${getTrendColor()}`}>
                        {getTrendIcon()}
                        <span className="text-sm font-semibold">{trendValue}</span>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">{title}</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{value}</span>
                    <span className="text-lg text-gray-600 font-medium">{unit}</span>
                </div>
                {subtitle && (
                    <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
                )}
            </div>

            {chartData.length > 0 && (
                <div className="mt-4">
                    <div className="flex items-end gap-1 h-12">
                        {chartData.slice(-12).map((data, index) => {
                            const height = ((data.value || 0) / maxChartValue) * 100;
                            return (
                                <div
                                    key={index}
                                    className="flex-1 bg-white/40 rounded-t-md hover:bg-white/60 transition-all cursor-pointer relative group"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {data.label}: {data.value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthMetricCard;

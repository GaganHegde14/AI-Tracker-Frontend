import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
    const isPositive = trend >= 0;

    return (
        <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-colors border border-zinc-800">
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>

                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border ${isPositive
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-semibold text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function SalesChart({ data, title, formatCurrency }) {
    const totalData = data.reduce((sum, item) => sum + (item.total || 0), 0);
    const averageData = data.length > 0 ? totalData / data.length : 0;
    const dataKey = data.length > 0 && data[0].hasOwnProperty('tanggal') ? 'tanggal' : 'bulan';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{label}</p>
                    <p className="text-sm text-green-600 font-bold">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {title}
                    </h3>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-sm font-bold text-green-600">{formatCurrency(totalData)}</p>
                </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(totalData)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(averageData)}</p>
                    </div>
                </div>
            </div>

            {data.length > 0 ? (
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey={dataKey} 
                                stroke="#9ca3af"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis 
                                stroke="#9ca3af"
                                tickFormatter={(value) => formatCurrency(value).replace('Rp', '').trim()}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="total" 
                                name="Penjualan"
                                fill="#10b981" 
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data penjualan</p>
                </div>
            )}
        </div>
    );
}
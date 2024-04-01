import React from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { type TooltipProps } from 'recharts';
import { type ValueType, type NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Prefecture } from './Prefectures';
import { Metadata } from './Charts';


interface ChartsGraphWrapperProps {
  chartRenderingList: Prefecture[];
  colorMap: Map<number, string>;
  chartRenderingData: Metadata[] | undefined;
}

export function ChartsGraphWrapper({ chartRenderingList, colorMap, chartRenderingData }: ChartsGraphWrapperProps) {
  return (
    <div className="charts-graph">
      <ResponsiveContainer width={'95%'} height={800}>
        <AreaChart data={chartRenderingData}>
          <defs>
            {chartRenderingList.map((prefecture: Prefecture) => {
              return (
                <linearGradient
                  key={prefecture.prefCode}
                  id={`color-${prefecture.prefCode}`}
                  x1="0" y1="0" x2="0" y2="1"
                >
                  <stop offset="40%" stopColor={colorMap.get(prefecture.prefCode)} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colorMap.get(prefecture.prefCode)} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <XAxis dataKey="year" />
          <YAxis
            width={85}
            tickFormatter={(value: number) => {
              if (Math.floor(value / 10000) === 0) {
                return '0';
              } else {
                return Math.floor(value / 10000) + '\n万人';
              }
            }}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
          <Legend layout={'vertical'} align={'right'} verticalAlign={'top'} />
          {chartRenderingList.map((prefecture: Prefecture) => {
            return (
              <Area
                key={prefecture.prefCode}
                type={'natural'}
                dot={true}
                dataKey={prefecture.prefName}
                fillOpacity={0.25}
                stroke={colorMap.get(prefecture.prefCode)}
                strokeWidth={2}
                fill={`url(#color-${prefecture.prefCode})`}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Tooltipをカスタム（データを降順で表示する）
function CustomTooltip({ payload, label, active }: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => {
      if (b.value && a.value) {
        return Number(b.value) - Number(a.value);
      } else {
        return 0;
      }
    });
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} 年`}</p>
        {sortedPayload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
}

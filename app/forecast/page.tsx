'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, ComposedChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { forecastData } from '@/lib/mock-data'

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Forecasting</h2>
        <p className="text-sm text-muted-foreground">Projected spend with confidence intervals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spend Forecast (45 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData}>
                <defs>
                  <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="upperBound" fill="url(#confidenceGrad)" stroke="none" />
                <Area type="monotone" dataKey="lowerBound" fill="url(#confidenceGrad)" stroke="none" />
                <Line type="monotone" dataKey="predicted" stroke="#4F46E5" strokeWidth={2} dot={false} name="Predicted" />
                <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} dot={false} name="Actual" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
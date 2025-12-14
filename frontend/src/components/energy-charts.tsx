'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const renewableEnergyData = [
  { name: 'Solar PV', potential: 207, unit: 'GW', color: '#f59e0b' },
  { name: 'Wind', potential: 155, unit: 'GW', color: '#06b6d4' },
  { name: 'Hydro', potential: 75, unit: 'GW', color: '#3b82f6' },
  { name: 'Geothermal', potential: 29, unit: 'GW', color: '#ef4444' },
  { name: 'Biomass', potential: 32, unit: 'GW', color: '#22c55e' },
];

const nickelProductionData = [
  { year: '2020', production: 760000, investment: 5 },
  { year: '2021', production: 1000000, investment: 8 },
  { year: '2022', production: 1400000, investment: 15 },
  { year: '2023', production: 1800000, investment: 25 },
  { year: '2024', production: 2100000, investment: 30 },
  { year: '2025', production: 2400000, investment: 35 },
];

const batteryComparisonData = [
  { metric: 'Energy Density', NMC: 270, LFP: 160, unit: 'Wh/kg' },
  { metric: 'Cycle Life', NMC: 1500, LFP: 4000, unit: 'cycles' },
  { metric: 'Cost', NMC: 150, LFP: 90, unit: 'USD/kWh' },
  { metric: 'Safety Score', NMC: 7, LFP: 10, unit: '/10' },
  { metric: 'Fast Charging', NMC: 9, LFP: 7, unit: '/10' },
];

const environmentalImpactData = [
  { category: 'CO2 Emissions', value: 35, target: 20 },
  { category: 'Water Usage', value: 68, target: 50 },
  { category: 'Waste Management', value: 78, target: 85 },
  { category: 'Energy Efficiency', value: 62, target: 80 },
  { category: 'Reforestation', value: 45, target: 70 },
];

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];

export function RenewableEnergyPotentialChart() {
  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Potensi Energi Terbarukan Indonesia
        </CardTitle>
        <CardDescription>
          Data dari jurnal penelitian terindeks (2024-2025)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={renewableEnergyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Gigawatt (GW)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [`${value} GW`, 'Potensi']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #10b981' }}
            />
            <Legend />
            <Bar dataKey="potential" fill="#10b981" radius={[8, 8, 0, 0]} name="Kapasitas Potensial">
              {renewableEnergyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          📚 <strong>Sumber:</strong> [20] Renewable Energy Potential Assessment (2025) - Total: <strong>498 GW</strong>
        </div>
      </CardContent>
    </Card>
  );
}

export function NickelProductionChart() {
  return (
    <Card className="border-teal-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏭 Produksi Nikel & Investasi Indonesia
        </CardTitle>
        <CardDescription>
          Tren hilirisasi 2020-2025 (data proyeksi)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={nickelProductionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" label={{ value: 'Produksi (ton)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Investasi (Miliar USD)', angle: 90, position: 'insideRight' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #14b8a6' }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="production" 
              stroke="#14b8a6" 
              strokeWidth={3}
              name="Produksi Nikel (ton/tahun)"
              dot={{ fill: '#14b8a6', r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="investment" 
              stroke="#f59e0b" 
              strokeWidth={3}
              name="Investasi (Miliar USD)"
              dot={{ fill: '#f59e0b', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          📚 <strong>Sumber:</strong> [12] Economic Impact of Indonesia Nickel Export Ban (2023)
        </div>
      </CardContent>
    </Card>
  );
}

export function BatteryComparisonChart() {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔋 Perbandingan Teknologi Baterai: NMC vs LFP
        </CardTitle>
        <CardDescription>
          Analisis multi-dimensional battery performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={batteryComparisonData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 'auto']} />
            <Radar 
              name="NMC Battery" 
              dataKey="NMC" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.5}
            />
            <Radar 
              name="LFP Battery" 
              dataKey="LFP" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.5}
            />
            <Legend />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #3b82f6' }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-700">⚡ NMC (Nickel Manganese Cobalt)</div>
            <ul className="mt-2 space-y-1 text-blue-600">
              <li>✓ High energy density</li>
              <li>✓ Premium EV applications</li>
              <li>⚠ Higher cost</li>
            </ul>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="font-semibold text-emerald-700">🔋 LFP (Lithium Iron Phosphate)</div>
            <ul className="mt-2 space-y-1 text-emerald-600">
              <li>✓ Excellent safety</li>
              <li>✓ Long cycle life</li>
              <li>✓ Cost-effective</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          📚 <strong>Sumber:</strong> [9] Advanced Nickel-Rich Cathode Materials, [22] Lithium Iron Phosphate Analysis (2024)
        </div>
      </CardContent>
    </Card>
  );
}

export function EnvironmentalImpactChart() {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌍 Environmental Impact - Nickel Smelting
        </CardTitle>
        <CardDescription>
          Current status vs sustainability targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={environmentalImpactData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="category" type="category" width={150} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #ef4444' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#ef4444" name="Current Status (%)" radius={[0, 8, 8, 0]} />
            <Bar dataKey="target" fill="#10b981" name="2030 Target (%)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-700 mb-2">⚠️ Critical Areas:</div>
          <ul className="text-sm text-red-600 space-y-1">
            <li>• <strong>CO2 Emissions:</strong> Perlu reduksi 43% untuk mencapai target net-zero 2030</li>
            <li>• <strong>Water Usage:</strong> Implementasi teknologi Zero Liquid Discharge (ZLD)</li>
            <li>• <strong>Reforestation:</strong> Program mangrove restoration perlu dipercepat 56%</li>
          </ul>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          📚 <strong>Sumber:</strong> [17] Carbon Footprint Analysis of Nickel Smelting, [28] Environmental Governance (2025)
        </div>
      </CardContent>
    </Card>
  );
}

export function EnergyMixPieChart() {
  const energyMixData = [
    { name: 'Fossil Fuels', value: 68, color: '#64748b' },
    { name: 'Renewable Energy', value: 22, color: '#10b981' },
    { name: 'Nuclear', value: 3, color: '#3b82f6' },
    { name: 'Others', value: 7, color: '#f59e0b' },
  ];

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌐 Current Energy Mix Indonesia (2025)
        </CardTitle>
        <CardDescription>
          Distribusi sumber energi nasional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={energyMixData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {energyMixData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="font-semibold text-emerald-700 mb-2">🎯 Target 2030:</div>
          <div className="text-sm text-emerald-600">
            Meningkatkan renewable energy mix menjadi <strong>38%</strong> melalui akselerasi 
            pembangunan solar PV, wind farms, dan geothermal plants.
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          📚 <strong>Sumber:</strong> [20] Renewable Energy Policy Framework Indonesia (2024)
        </div>
      </CardContent>
    </Card>
  );
}

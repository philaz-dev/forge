"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { RETURN_RATE_SERIES } from "@/data/clinic";
import { formatShort, toDate, year, type ISODate } from "@/lib/dates";
import { euro, kg } from "@/lib/format";
import type { WeightPoint } from "@/domain/types";

const SAGE = "#436C54";
const GRID = "#ECECE5";
const AXIS = { fontSize: 11, fill: "#98A19B" };

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-pop">
      {children}
    </div>
  );
}

export function ReturnRateChart() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart
        data={[...RETURN_RATE_SERIES]}
        margin={{ top: 8, right: 6, left: 6, bottom: 0 }}
      >
        <defs>
          <linearGradient id="rr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SAGE} stopOpacity={0.22} />
            <stop offset="1" stopColor={SAGE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          interval={2}
          padding={{ left: 14, right: 14 }}
        />
        <YAxis hide domain={[68, 82]} />
        <Tooltip
          cursor={{ stroke: "#C9DACF", strokeWidth: 1 }}
          content={({ active, payload, label }) =>
            active && payload?.[0] ? (
              <TipBox>
                <p className="text-ink-muted">{label}</p>
                <p className="num text-sm font-semibold">
                  {String(payload[0].value).replace(".", ",")} % de retour
                </p>
              </TipBox>
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="rate"
          stroke={SAGE}
          strokeWidth={2}
          fill="url(#rr)"
          activeDot={{ r: 4, fill: SAGE, stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Barres horizontales d'un montant par catégorie (une seule teinte, sauge). */
export function PotentialBars({
  data,
  active,
  onSelect,
}: {
  data: { name: string; value: number }[];
  active?: string;
  onSelect?: (name: string) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={data.length * 40 + 8}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        barCategoryGap={10}
      >
        <CartesianGrid horizontal={false} stroke={GRID} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={86}
          tick={{ fontSize: 12, fill: "#3B4640" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(88,132,105,0.07)" }}
          content={({ active: a, payload }) =>
            a && payload?.[0] ? (
              <TipBox>
                <p className="font-medium">{payload[0].payload.name}</p>
                <p className="num text-ink-muted">
                  {euro(payload[0].value as number)} estimés
                </p>
              </TipBox>
            ) : null
          }
        />
        <Bar
          dataKey="value"
          radius={[0, 4, 4, 0]}
          barSize={14}
          onClick={(d) => onSelect?.((d as unknown as { name: string }).name)}
        >
          {data.map((d) => (
            <Cell
              key={d.name}
              fill={!active || active === d.name ? SAGE : "#C9DACF"}
              cursor={onSelect ? "pointer" : "default"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const MONTHS = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

export function WeightChart({
  points,
  height = 300,
  simple,
  band,
}: {
  points: WeightPoint[];
  height?: number;
  /** Version épurée (espace propriétaire). */
  simple?: boolean;
  /** Fourchette indicative (à ne pas interpréter comme un diagnostic). */
  band?: [number, number];
}) {
  const data = points.map((p) => ({ ...p, t: toDate(p.date).getTime() }));
  const min = Math.min(...points.map((p) => p.kg));
  const max = Math.max(...points.map((p) => p.kg));
  const pad = Math.max(1, (max - min) * 0.25);
  const domain: [number, number] = [
    Math.floor(min - pad),
    Math.ceil(max + pad),
  ];
  const ticks = Array.from(
    new Set(data.map((d) => year(d.date as ISODate))),
  ).map((y) => Date.UTC(y, 0, 1));
  const color = simple ? "#436C54" : SAGE;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 14, right: 18, left: simple ? 0 : -8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke={GRID} />
        {band && !simple && (
          <ReferenceArea
            y1={band[0]}
            y2={band[1]}
            fill="#E4EDE7"
            fillOpacity={0.55}
            ifOverflow="extendDomain"
          />
        )}
        <XAxis
          dataKey="t"
          type="number"
          scale="time"
          domain={[data[0]!.t, data[data.length - 1]!.t]}
          ticks={ticks.filter((t) => t >= data[0]!.t - 31_536_000_000 / 2)}
          tickFormatter={(t) => String(new Date(t).getUTCFullYear())}
          tick={AXIS}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={domain}
          tickCount={5}
          allowDecimals={false}
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          width={simple ? 30 : 40}
          tickFormatter={(v) => `${v}`}
          hide={simple}
        />
        <Tooltip
          cursor={{ stroke: "#C9DACF", strokeWidth: 1 }}
          content={({ active, payload }) =>
            active && payload?.[0] ? (
              <TipBox>
                <p className="text-ink-muted">
                  {MONTHS.format(new Date(payload[0].payload.t))}
                </p>
                <p className="num text-sm font-semibold">
                  {kg(payload[0].value as number)}
                </p>
                <p className="text-[11px] text-ink-faint">
                  {formatShort(payload[0].payload.date)}
                </p>
              </TipBox>
            ) : null
          }
        />
        <Line
          type="monotone"
          dataKey="kg"
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: "#fff", stroke: color, strokeWidth: 2 }}
          activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 3 }}
          animationDuration={900}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export { Area };

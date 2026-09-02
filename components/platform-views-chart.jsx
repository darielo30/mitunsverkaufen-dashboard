"use client";;
import { useId } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { formatChartAxisTick } from "@/components/formater";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "@/components/dashboard-card";

const chartConfig = {
    instagram: {
		label: "Instagram",
		color: "var(--chart-2)",
	},

    tiktok: {
		label: "TikTok",
		color: "var(--chart-1)",
	}
};

export function PlatformViewsChart({ rows, growthPct }) {
	const chartUid = useId().replace(/:/g, "");
	const idLineGlow = `platform-views-line-glow-${chartUid}`;

	return (
		<DashboardCard className="gap-0 md:col-span-2">
			<CardHeader>
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<CardTitle>Aufrufe nach Plattform</CardTitle>
						{growthPct !== null && (
							<Delta value={growthPct} variant="badge">
								<DeltaIcon variant="trend" />
								<DeltaValue />
							</Delta>
						)}
					</div>
					<CardDescription>
						Aufrufe pro Tag, letzte {rows.length} Tage.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className="aspect-auto h-60 w-full p-0 md:h-80"
					config={chartConfig}
				>
					<LineChart
						accessibilityLayer
						data={rows}
						margin={{
							left: 12,
							right: 12,
							top: 8,
						}}
					>
						<CartesianGrid className="stroke-border" vertical={false} />
						<XAxis
							axisLine={false}
							dataKey="date"
							interval={0}
							tickFormatter={(value) => formatChartAxisTick(String(value), rows.length)}
							tickLine={false}
							tickMargin={8}
						/>
						<ChartTooltip
							content={<ChartTooltipContent hideLabel />}
							cursor={false}
						/>
						<defs>
							<filter
								height="140%"
								id={idLineGlow}
								width="140%"
								x="-20%"
								y="-20%"
							>
								<feGaussianBlur result="blur" stdDeviation="10" />
								<feComposite in="SourceGraphic" in2="blur" operator="over" />
							</filter>
						</defs>
						<Line
							dataKey="tiktok"
							dot={false}
							filter={`url(#${idLineGlow})`}
							stroke="var(--color-tiktok)"
							strokeWidth={2}
							type="step"
						/>
						<Line
							dataKey="instagram"
							dot={false}
							filter={`url(#${idLineGlow})`}
							stroke="var(--color-instagram)"
							strokeWidth={2}
							type="step"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</DashboardCard>
	);
}

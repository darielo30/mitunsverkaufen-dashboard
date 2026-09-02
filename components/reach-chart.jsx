"use client";;
import { Bar, BarChart, XAxis } from "recharts";
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
    reach: {
		label: "Reichweite",
		color: "var(--chart-2)",
	}
};

function CustomGradientBar(
	props
) {
	const {
		fill,
		x = 0,
		y = 0,
		width = 0,
		height = 0,
		dataKey = "reach",
		index = 0,
	} = props;
	const gid = `gradient-bar-${String(dataKey)}-${index}`;

	return (
		<>
			<rect
				fill={`url(#${gid})`}
				height={height}
				stroke="none"
				width={width}
				x={x}
				y={y}
			/>
			<rect fill={fill} height={2} stroke="none" width={width} x={x} y={y} />
			<defs>
				<linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor={fill} stopOpacity={0.5} />
					<stop offset="100%" stopColor={fill} stopOpacity={0} />
				</linearGradient>
			</defs>
		</>
	);
}

export function ReachChart({ rows, growthPct }) {
	return (
		<DashboardCard className="gap-0 md:col-span-2">
			<CardHeader className="gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle>Reichweite je Beitrag</CardTitle>
					{growthPct !== null && (
						<Delta value={growthPct} variant="badge">
							<DeltaIcon variant="trend" />
							<DeltaValue />
						</Delta>
					)}
				</div>
				<CardDescription>Die letzten veröffentlichten Beiträge.</CardDescription>
			</CardHeader>
			<CardContent>
				{rows.length > 0 ? (
					<ChartContainer
						className="aspect-auto h-60 w-full md:h-80"
						config={chartConfig}
					>
						<BarChart accessibilityLayer data={rows}>
							<XAxis
								axisLine={false}
								dataKey="label"
								interval={0}
								tickFormatter={(value) => String(value)}
								tickLine={false}
								tickMargin={10}
							/>
							<ChartTooltip
								content={<ChartTooltipContent hideLabel />}
								cursor={false}
							/>
							<Bar
								dataKey="reach"
								fill="var(--color-reach)"
								shape={<CustomGradientBar />}
							/>
						</BarChart>
					</ChartContainer>
				) : (
					<div className="flex h-60 items-center justify-center text-center text-muted-foreground text-sm md:h-80">
						Noch keine veröffentlichten Beiträge mit Reichweite
					</div>
				)}
			</CardContent>
		</DashboardCard>
	);
}

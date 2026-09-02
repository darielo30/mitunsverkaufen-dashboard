import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { DashboardCard } from "@/components/dashboard-card";
import { TargetIcon, CircleCheckIcon } from "lucide-react";

export function MonthlyGoal({ done, goal, pct }) {
	const onTrack = pct >= 100 || done >= goal;

	return (
		<DashboardCard className="gap-0">
			<CardHeader className="border-b">
				<CardTitle className="text-balance text-base">Monatsziel</CardTitle>
				<CardDescription className="text-pretty">
					{onTrack ? "Ziel erreicht — stark." : "Content-Pipeline für diesen Monat."}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex h-full flex-col justify-center gap-4 px-6 py-6">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							{onTrack ? <CircleCheckIcon aria-hidden="true" /> : <TargetIcon aria-hidden="true" />}
						</EmptyMedia>
						<EmptyTitle>{done} / {goal} Beiträge</EmptyTitle>
						<EmptyDescription className="text-xs">
							{onTrack
								? "Alle geplanten Beiträge für diesen Monat sind live."
								: `Noch ${Math.max(0, goal - done)} Beiträge bis zum Ziel.`}
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="w-full">
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary transition-[width]"
								style={{ width: `${Math.min(100, pct)}%` }}
							/>
						</div>
					</EmptyContent>
				</Empty>
			</CardContent>
		</DashboardCard>
	);
}

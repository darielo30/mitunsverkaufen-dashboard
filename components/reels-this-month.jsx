import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { ClapperboardIcon } from "lucide-react";
import { formatInteger } from "@/components/formater";

export function ReelsThisMonth({ reels }) {
	return (
		<DashboardCard className="gap-0">
			<CardHeader className="border-b">
				<CardTitle>Reels diesen Monat</CardTitle>
				<CardDescription>{reels.length} veröffentlicht.</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				{reels.length === 0 ? (
					<div className="flex h-40 items-center justify-center text-center text-muted-foreground text-sm">
						Noch keine Reels diesen Monat
					</div>
				) : (
					<ul className="flex flex-col divide-y divide-border">
						{reels.map((r) => (
							<li className="flex h-16 items-center gap-3 px-6" key={r.id}>
								<span
									aria-hidden="true"
									className="flex size-10 shrink-0 items-center justify-center [&_svg]:size-4"
								>
									<ClapperboardIcon />
								</span>
								<div className="min-w-0 flex-1 space-y-1">
									<p className="line-clamp-1 text-pretty text-foreground text-sm leading-snug">
										{r.title}
									</p>
									<p className="text-muted-foreground text-xs">{r.dateLabel}</p>
								</div>
								<span className="shrink-0 text-muted-foreground text-xs tabular-nums">
									{formatInteger(r.views)} Views
								</span>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</DashboardCard>
	);
}

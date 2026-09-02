"use client";

import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/dashboard-card";
import { formatInteger } from "@/components/formater";

export function TopPosts({ posts }) {
	return (
		<DashboardCard className="relative gap-0 md:col-span-2">
			<CardHeader className="border-b">
				<CardTitle className="text-base">Top Beiträge</CardTitle>
				<CardDescription>Meiste Reichweite diesen Monat.</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				<Table>
					<TableCaption className="sr-only">
						Top Beiträge diesen Monat nach Reichweite.
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="ps-6">Beitrag</TableHead>
							<TableHead>Plattform</TableHead>
							<TableHead className="pe-6 text-right tabular-nums">
								Reichweite
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.length === 0 && (
							<TableRow>
								<TableCell className="ps-6 py-8 text-center text-muted-foreground" colSpan={3}>
									Noch keine Beiträge diesen Monat
								</TableCell>
							</TableRow>
						)}
						{posts.map((p) => (
							<TableRow className="h-12" key={p.id}>
								<TableCell className="max-w-56 truncate ps-6 font-medium">
									{p.title}
								</TableCell>
								<TableCell>
									<Badge variant="secondary">
										{p.platform === "instagram" ? "Instagram" : "TikTok"}
									</Badge>
								</TableCell>
								<TableCell className="pe-6 text-right tabular-nums">
									{formatInteger(p.reach)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</DashboardCard>
	);
}

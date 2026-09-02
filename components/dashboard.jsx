import { MonthlyGoal } from "@/components/monthly-goal";
import { PlatformViewsChart } from "@/components/platform-views-chart";
import { ReelsThisMonth } from "@/components/reels-this-month";
import { TopPosts } from "@/components/top-posts";
import { ReachChart } from "@/components/reach-chart";
import { DashboardStats } from "@/components/stats";

export function SocialDashboard({ data }) {
	return (
		<div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
			<DashboardStats stats={data.stats} />
			<ReachChart rows={data.reachRows} growthPct={data.reachGrowthPct} />
			<PlatformViewsChart rows={data.viewsRows} growthPct={data.viewsGrowthPct} />
			<TopPosts posts={data.topPosts} />
			<MonthlyGoal done={data.goalDone} goal={data.goalTarget} pct={data.goalPct} />
			<ReelsThisMonth reels={data.reels} />
		</div>
	);
}

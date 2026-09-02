"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SocialDashboard } from "@/components/dashboard";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

const MONTHLY_GOAL = 30;

function monthKey(d) {
	const dt = new Date(d);
	return `${dt.getFullYear()}-${dt.getMonth()}`;
}

function dayKey(d) {
	return new Date(d).toISOString().slice(0, 10);
}

function sumOf(list, key) {
	return list.reduce((a, p) => a + (p[key] || 0), 0);
}

function pctDelta(curr, prev) {
	return prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null;
}

async function fetchAccounts() {
	try {
		const res = await fetch("/api/late?action=accounts");
		const data = await res.json();
		if (!res.ok || data.error) return [];

		let accs = [];
		if (data.accounts && Array.isArray(data.accounts)) accs = data.accounts;
		else if (Array.isArray(data)) accs = data;
		else if (data._raw) {
			if (Array.isArray(data._raw)) accs = data._raw;
			else if (data._raw.accounts) accs = data._raw.accounts;
			else if (data._raw.data) accs = data._raw.data;
		} else if (data.data && Array.isArray(data.data)) accs = data.data;

		return accs.map((a) => ({
			platform: (a.platform || a.provider || a.type || "").toLowerCase(),
			name: a.name || a.username || a.displayName || a.handle || "Unbekannt",
			followers: a.followers ?? a.followersCount ?? a.followerCount ?? a.subscriberCount ?? a.audienceSize ?? null,
		}));
	} catch {
		return [];
	}
}

async function fetchPosts() {
	try {
		const res = await fetch("/api/late?action=posts");
		if (!res.ok) return [];
		const data = await res.json();
		if (data.error) return [];

		const rawPosts = data._raw;
		const postsList = data.posts || (Array.isArray(rawPosts) ? rawPosts : rawPosts?.posts) || (Array.isArray(data) ? data : []);
		if (!Array.isArray(postsList)) return [];

		return postsList.map((p, i) => {
			const plats = p.platforms?.map((pl) => pl.platform || pl).filter(Boolean) || ["instagram"];
			const a = p.analytics || {};
			return {
				id: p._id || p.id || i + 1,
				platform: plats[0],
				title: p.content?.substring(0, 60) + (p.content?.length > 60 ? "..." : "") || "Unbenannt",
				date: p.scheduledFor || p.createdAt || new Date().toISOString(),
				publishedAt: p.publishedAt || p.completedAt || undefined,
				status: p.status || "draft",
				isVideo: (p.mediaItems || p.media || []).some((m) => (typeof m !== "string" && (m?.type === "video" || m?.mediaType === "video")) || (typeof m === "string" && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(m))),
				views: a.views || a.impressions || 0,
				likes: a.likes || 0,
				comments: a.comments || 0,
				shares: a.shares || 0,
				reach: a.reach || 0,
				impressions: a.impressions || 0,
			};
		});
	} catch {
		return [];
	}
}

function buildDashboardData(accounts, posts) {
	const now = new Date();
	const thisMonthKey = monthKey(now);
	const lastMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

	const published = posts.filter((p) => p.status === "published");
	const thisMonth = published.filter((p) => monthKey(p.publishedAt || p.date) === thisMonthKey);
	const lastMonth = published.filter((p) => monthKey(p.publishedAt || p.date) === lastMonthKey);

	const reachThis = sumOf(thisMonth, "reach") || sumOf(thisMonth, "views");
	const reachLast = sumOf(lastMonth, "reach") || sumOf(lastMonth, "views");
	const viewsThis = sumOf(thisMonth, "views");
	const viewsLast = sumOf(lastMonth, "views");
	const engThis = sumOf(thisMonth, "likes") + sumOf(thisMonth, "comments") + sumOf(thisMonth, "shares");
	const impThis = sumOf(thisMonth, "impressions") || reachThis;
	const engRateThis = impThis > 0 ? (engThis / impThis) * 100 : 0;
	const engLast = sumOf(lastMonth, "likes") + sumOf(lastMonth, "comments") + sumOf(lastMonth, "shares");
	const impLast = sumOf(lastMonth, "impressions") || reachLast;
	const engRateLast = impLast > 0 ? (engLast / impLast) * 100 : 0;

	const followersKnown = accounts.filter((a) => typeof a.followers === "number");
	const followersTotal = followersKnown.length > 0 ? sumOf(followersKnown, "followers") : null;

	const stats = [
		{ label: "Reichweite (Monat)", value: reachThis.toLocaleString("de-DE"), delta: pctDelta(reachThis, reachLast) },
		{ label: "Engagement Rate", value: `${engRateThis.toFixed(2)}%`, delta: pctDelta(engRateThis, engRateLast) },
		{ label: "Follower gesamt", value: followersTotal === null ? "—" : followersTotal.toLocaleString("de-DE"), delta: null },
		{ label: "Views (Monat)", value: viewsThis.toLocaleString("de-DE"), delta: pctDelta(viewsThis, viewsLast) },
	];

	const reachRows = [...published]
		.sort((x, y) => new Date(x.publishedAt || x.date) - new Date(y.publishedAt || y.date))
		.slice(-8)
		.map((p) => ({ label: p.title.length > 14 ? p.title.slice(0, 13) + "…" : p.title, reach: p.reach || p.views || 0 }));

	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(now);
		d.setDate(d.getDate() - (6 - i));
		return dayKey(d);
	});
	const viewsRows = last7Days.map((date) => {
		const dayPosts = published.filter((p) => dayKey(p.publishedAt || p.date) === date);
		return {
			date,
			instagram: sumOf(dayPosts.filter((p) => p.platform === "instagram"), "views"),
			tiktok: sumOf(dayPosts.filter((p) => p.platform === "tiktok"), "views"),
		};
	});
	const viewsFirst = viewsRows[0];
	const viewsLastRow = viewsRows[viewsRows.length - 1];
	const viewsGrowthPct = viewsFirst && (viewsFirst.instagram + viewsFirst.tiktok) > 0
		? pctDelta(viewsLastRow.instagram + viewsLastRow.tiktok, viewsFirst.instagram + viewsFirst.tiktok)
		: null;

	const topPosts = [...thisMonth]
		.sort((x, y) => (y.reach || y.views || 0) - (x.reach || x.views || 0))
		.slice(0, 5)
		.map((p) => ({ id: p.id, title: p.title, platform: p.platform, reach: p.reach || p.views || 0 }));

	const reels = [...thisMonth]
		.filter((p) => p.isVideo)
		.sort((x, y) => new Date(y.publishedAt || y.date) - new Date(x.publishedAt || x.date))
		.map((p) => ({
			id: p.id,
			title: p.title,
			views: p.views,
			dateLabel: new Date(p.publishedAt || p.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" }),
		}));

	const goalDone = thisMonth.length;

	return {
		stats,
		reachRows,
		reachGrowthPct: pctDelta(reachThis, reachLast),
		viewsRows,
		viewsGrowthPct,
		topPosts,
		reels,
		goalDone,
		goalTarget: MONTHLY_GOAL,
		goalPct: Math.min(100, Math.round((goalDone / MONTHLY_GOAL) * 100)),
	};
}

export default function Dashboard2Page() {
	const [data, setData] = useState(null);

	useEffect(() => {
		let cancelled = false;
		Promise.all([fetchAccounts(), fetchPosts()]).then(([accounts, posts]) => {
			if (cancelled) return;
			setData(buildDashboardData(accounts, posts));
		});
		return () => { cancelled = true; };
	}, []);

	return (
		<TooltipProvider>
			<AppShell>
				<div className="mb-6">
					<h1 className="font-semibold text-2xl tracking-tight">Übersicht</h1>
					<p className="text-muted-foreground text-sm">Reichweite, Engagement und Top-Beiträge von mitunsverkaufen.de.</p>
				</div>
				{data ? <SocialDashboard data={data} /> : <DashboardSkeleton />}
			</AppShell>
		</TooltipProvider>
	);
}

import { LayoutGridIcon, BarChart3Icon, SendIcon, PlugIcon, SettingsIcon, HelpCircleIcon, BookOpenIcon } from "lucide-react";

export const navGroups = [
	{
		label: "Workspace",
		items: [
			{
				title: "Übersicht",
				path: "#/dashboard-2",
				icon: (
					<LayoutGridIcon
					/>
				),
				isActive: true,
			},
			{
				title: "Posts",
				path: "#/dashboard-2",
				icon: (
					<SendIcon
					/>
				),
			},
			{
				title: "Statistiken",
				path: "#/dashboard-2",
				icon: (
					<BarChart3Icon
					/>
				),
			},
		],
	},
	{
		label: "Verwaltung",
		items: [
			{
				title: "Verbindungen",
				path: "#/dashboard-2",
				icon: (
					<PlugIcon
					/>
				),
			},
			{
				title: "Einstellungen",
				path: "#/dashboard-2",
				icon: (
					<SettingsIcon
					/>
				),
			},
		],
	},
];

export const footerNavLinks = [
	{
		title: "Hilfe",
		path: "#/dashboard-2",
		icon: (
			<HelpCircleIcon
			/>
		),
	},
	{
		title: "Changelog",
		path: "#/dashboard-2",
		icon: (
			<BookOpenIcon
			/>
		),
	},
];

export const navLinks = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];

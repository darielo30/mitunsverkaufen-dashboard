"use client";

import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";

const user = {
	name: "Dariel",
	email: "darielo30@live.de",
};

export function NavUser() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Avatar className="size-8" />}><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuItem className="flex items-center justify-start gap-2">
					<DropdownMenuLabel className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<span className="font-medium text-foreground">{user.name}</span>{" "}
							<br />
							<div className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-muted-foreground text-xs">
								{user.email}
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserIcon
						/>
						Konto
					</DropdownMenuItem>
					<DropdownMenuItem>
						<SettingsIcon
						/>
						Einstellungen
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="w-full cursor-pointer"
						variant="destructive"
					>
						<LogOutIcon
						/>
						Abmelden
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

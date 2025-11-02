'use client';

import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';
import { OrganizationSwitcher, UserButton } from '@daveyplate/better-auth-ui';
import { SquareTerminal } from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const data = {
		'Group 1': [
			{
				title: 'Links',
				url: '#',
				icon: SquareTerminal,
				isActive: true,
				items: [
					{
						title: 'Test',
						url: '/test',
					},
					{
						title: 'Subscriptions',
						url: '/account/subscription',
					},
					{
						title: 'Custom Info',
						url: '/custom-info',
					},
				],
			},
		],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<OrganizationSwitcher
					classNames={{
						trigger: {
							base: 'bg-transparent! text-primary!',
						},
					}}
				/>
			</SidebarHeader>
			<SidebarContent>
				{Object.keys(data).map((key: string) => (
					<NavMain key={key} groupName={key} items={data[key]} />
				))}
			</SidebarContent>
			<SidebarFooter>
				<UserButton
					classNames={{
						trigger: {
							base: 'bg-transparent! text-primary!',
						},
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

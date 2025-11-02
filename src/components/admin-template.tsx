'use client';
import { AppSidebar } from '@/components/app-sidebar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeSwitcher } from './theme-switcher';
import { IBreadcrumbItem, IWithChild } from '@/types/common';
import { Fragment } from 'react/jsx-runtime';
import Link from 'next/link';
import { useGlobalStore } from '@/stores/global';
import Loading from './fallback';
import ProtectedPage from './protected-page';
import RealTimeNotification from './real-time-notification';

interface IProps extends IWithChild {
	breadcrumb?: IBreadcrumbItem[];
}

export default function AdminTemplate({ children, breadcrumb = [] }: IProps) {
	const { globalLoading } = useGlobalStore();

	return (
		<ProtectedPage>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full">
						<div className="flex items-center gap-2 px-4 w-full">
							<div className="flex items-center gap-2">
								<SidebarTrigger className="-ml-1 block" />
								<Separator
									orientation="vertical"
									className="mr-2 data-[orientation=vertical]:h-4"
								/>
							</div>
							<Breadcrumb>
								<BreadcrumbList>
									{breadcrumb.map((x: IBreadcrumbItem, index: any) => (
										<Fragment key={index}>
											<BreadcrumbItem className="hidden md:block">
												{x?.href ? (
													<Link href={x.href}>
														<BreadcrumbPage className="opacity-50">
															{x.label}
														</BreadcrumbPage>
													</Link>
												) : (
													<BreadcrumbPage>{x.label}</BreadcrumbPage>
												)}
											</BreadcrumbItem>
											{index !== breadcrumb.length - 1 && (
												<BreadcrumbSeparator className="hidden md:block" />
											)}
										</Fragment>
									))}
								</BreadcrumbList>
							</Breadcrumb>
							<div className="ml-auto">
								<ThemeSwitcher />
							</div>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						{globalLoading ? <Loading /> : children}
					</div>
				</SidebarInset>
			</SidebarProvider>
			<RealTimeNotification />
		</ProtectedPage>
	);
}

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { COMPONENTS } from '@/constants/routes';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import ListItem from './ListItem';

const Header = () => {
	const [path, setPath] = useState('#products');

	return (
		<header className='p-4 flex justify-center items-center'>
			<Link href='/' className='w-full flex gap-2 justify-left items-center'>
				<Image
					src='/cypress-logo.svg'
					alt='Cypress Logo'
					width={25}
					height={25}
				/>
				<span className='font-semibold dark:text-white'>cypress.</span>
			</Link>
			<NavigationMenu className='hidden md:block'>
				<NavigationMenuList className='gap-6'>
					<NavigationMenuItem>
						<NavigationMenuTrigger
							onClick={() => setPath('#resources')}
							className={cn('text-xl font-normal', {
								'dark:text-white': path === '#resources',
								'dark:text-white/40': path !== '#resources',
							})}
						>
							Resources
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid gap-3 p-6 md:w-[400px] ld:w-[500px] lg:grid-cols-[.75fr_1fr]'>
								<li className='row-span-3'>
									<span className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'>
										Welcome
									</span>
								</li>
								<ListItem href='#' title='Introduction'>
									Re-usable components built using Radix UI and Tailwind CSS.
								</ListItem>
								<ListItem href='#' title='Installation'>
									How to install dependencies and structure your app.
								</ListItem>
								<ListItem href='#' title='Typography'>
									Styles for headings, paragraphs, lists...etc
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger
							onClick={() => setPath('#pricing')}
							className={cn({
								'dark:text-white': path === '#pricing',
								'dark:text-white/40': path !== '#pricing',
								'font-normal': true,
								'text-xl': true,
							})}
						>
							Pricing
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid w-[400px] gap-3 p-4  md:grid-row-2  '>
								<ListItem title='Pro Plan' href='#'>
									Unlock full power with collaboration.
								</ListItem>
								<ListItem title='free Plan' href='#'>
									Great for teams just starting out.
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuContent>
							<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2  lg:w-[600px]'>
								{COMPONENTS.map((component) => (
									<ListItem
										key={component.title}
										title={component.title}
										href={component.href}
									>
										{component.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink
							className={cn(navigationMenuTriggerStyle(), {
								'dark:text-white': path === '#testimonials',
								'dark:text-white/40': path !== '#testimonials',
								'font-normal': true,
								'text-xl': true,
							})}
						>
							Testimonial
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<aside className='flex w-full gap-2 justify-end'>
				<Link
					href='/login'
					className='bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-3 py-2 rounded-lg'
				>
					Login
				</Link>
				<Link
					href='/sign-up'
					className='bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 rounded-lg'
				>
					Sign Up
				</Link>
			</aside>
		</header>
	);
};

export default Header;

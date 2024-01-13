'use client';
import { Menu, HexagonIcon } from 'lucide-react';
import React, { useState, type PropsWithChildren } from 'react';
import clsx from 'clsx';

const LIST = [
	{ title: 'Sidebar', id: 'sidebar', Icon: Menu },
	{ title: 'Pages', id: 'pages', Icon: HexagonIcon },
] as const;

type Props = PropsWithChildren;
const MobileSidebar = ({ children }: Props) => {
	const [selectedNav, setSelectedNav] = useState('');
	return (
		<>
			{selectedNav === 'sidebar' && <>{children}</>}
			<nav className='bg-black/10 backdrop-blur-lg sm:hidden fixed z-50 bottom-0 right-0 left-0'>
				<ul className='flex justify-between items-center p-4'>
					{LIST.map(({ id, title, Icon }) => (
						<li
							key={id}
							className='flex items-center flex-col justify-center cursor-pointer'
							onClick={() => setSelectedNav(selectedNav ? '' : id)}
						>
							<Icon />
							<small
								className={clsx({
									'text-muted-foreground': selectedNav !== id,
								})}
							>
								{title}
							</small>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
};

export default MobileSidebar;

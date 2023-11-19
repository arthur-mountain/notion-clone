import { NavigationMenuLink } from '@/components/ui/navigation-menu';

const ListItem = ({
	className,
	title,
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
	return (
		<NavigationMenuLink asChild>
			<a
				className='group block select-none space-y-1 font-medium leading-none'
				{...props}
			>
				<div className='text-white text-sm font-medium leading-none'>
					{title}
				</div>
				<p className='group-hover:text-white/70 line-clamp-2 text-sm leading-snug text-white/40'>
					{children}
				</p>
			</a>
		</NavigationMenuLink>
	);
};

// ListItem.displayName = 'ListItem';

export default ListItem;

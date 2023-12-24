import { cn } from '@/lib/utils';

export const getStyles = (type: 'folder' | 'file') => {
	const isFolder = type === 'folder';
	const groupIdentifies = cn(
		'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
		{ 'group/folder': isFolder, 'group/file': !isFolder },
	);
	const listStyles = cn('relative', {
		'border-none text-md': isFolder,
		'border-none ml-6 text-[16px] py-1': !isFolder,
	});
	const hoverStyles = cn(
		'h-full hidden rounded-sm absolute right-0 items-center justify-center',
		{
			'group-hover/file:block': type === 'file',
			'group-hover/folder:block': type === 'folder',
		},
	);
	return { groupIdentifies, listStyles, hoverStyles };
};

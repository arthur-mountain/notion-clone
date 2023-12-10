import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
	header?: string;
	content?: React.ReactNode;
	children: React.ReactNode;
	description?: string;
	className?: string;
};

const CustomDialog = ({
	header,
	content,
	children,
	description,
	className,
}: Props) => {
	return (
		<Dialog>
			<DialogTrigger className={cn('', className)}>{children}</DialogTrigger>
			<DialogContent className='h-screen block sm:h-[440px] overflow-scroll w-full'>
				<DialogHeader>
					<DialogTitle>{header}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{content}
			</DialogContent>
		</Dialog>
	);
};

export default CustomDialog;

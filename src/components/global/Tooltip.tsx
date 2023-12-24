import React from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
type Props = {
	children: React.ReactNode;
	message: string;
};

const CustomTooltip = ({ children, message }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent>{message}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CustomTooltip;

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Props = {
	collaborators: { id: string; email: string; avatarUrl: string }[];
	isSaving: boolean;
};

const InTrashMessage = ({ collaborators, isSaving }: Props) => {
	return (
		<div className='flex items-center gap-4'>
			<div className='flex items-center justify-center h-10 gap-2'>
				{collaborators?.map((collaborator) => (
					<TooltipProvider key={collaborator.id}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Avatar className='bg-background border-2 flex items-center justify-center border-white h-8 w-8 rounded-full'>
									<AvatarImage
										src={collaborator.avatarUrl ? collaborator.avatarUrl : ''}
										className='rounded-full'
									/>
									<AvatarFallback>
										{collaborator.email.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</TooltipTrigger>
							<TooltipContent>{collaborator.email}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
				{isSaving ? (
					<Badge
						variant='secondary'
						className='bg-orange-600 top-4 text-white right-4 z-50'
					>
						Saving...
					</Badge>
				) : (
					<Badge
						variant='secondary'
						className='bg-emerald-600 top-4 text-white right-4 z-50'
					>
						Saved
					</Badge>
				)}
			</div>
		</div>
	);
};

export default InTrashMessage;

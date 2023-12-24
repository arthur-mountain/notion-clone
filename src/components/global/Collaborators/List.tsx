import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import useCollaborators from './use-collaborators';

const CollaboratorList = () => {
	const {
		store: { collaborators },
		action: { deleteCollaborator },
	} = useCollaborators();

	return (
		<>
			<span className='text-sm text-muted-foreground'>
				Collaborators {collaborators.length || ''}
			</span>
			<ScrollArea className='h-[120px] w-full rounded-md border border-muted-foreground/20'>
				{collaborators.length > 0 ? (
					collaborators.map((c) => (
						<div key={c.id} className='p-4 flex justify-between items-center'>
							<div className='flex gap-4 items-center'>
								<Avatar>
									<AvatarImage src='/avatars/7.png' />
									<AvatarFallback>PJ</AvatarFallback>
								</Avatar>
								<div className='text-sm  gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]'>
									{c.email}
								</div>
							</div>
							<Button variant='secondary' onClick={() => deleteCollaborator(c)}>
								Remove
							</Button>
						</div>
					))
				) : (
					<div className='absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center'>
						<span className='text-muted-foreground text-sm'>
							You have no collaborators
						</span>
					</div>
				)}
			</ScrollArea>
		</>
	);
};

export default CollaboratorList;

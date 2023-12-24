'use client';
import type { UserType } from '@/lib/supabase/types';
import { Search, Plus } from 'lucide-react';
import {
	useEffect,
	useState,
	useDeferredValue,
	type ChangeEvent,
	type PropsWithChildren,
} from 'react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getUsersByEmail } from '@/lib/supabase/schemas/users/queries';
import { useUser } from '../../providers/UserProvider';

type Props = PropsWithChildren<{
	existsCollaboratorIdsSet: Set<string>;
	addCollaborator: (collaborator: UserType) => void;
}>;

const CollaboratorSearch = ({
	existsCollaboratorIdsSet,
	addCollaborator,
	children,
}: Props) => {
	const {
		store: { user: authUser },
	} = useUser();
	const [searchUsers, setSearchUsers] = useState<UserType[]>([]);
	const [email, setEmail] = useState('');
	const deferredEmail = useDeferredValue(email);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.currentTarget.value);
	};

	useEffect(() => {
		if (!deferredEmail) return;
		(async () => {
			const { data: users } = await getUsersByEmail(deferredEmail);
			if (users) setSearchUsers(users);
		})();
	}, [deferredEmail]);

	return (
		<Sheet>
			<SheetTrigger className='mx-auto text-sm mt-4 flex items-center justify-center  whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary-purple-500 text-white shadow-sm hover:bg-primary-purple-500/80 h-8 rounded-md px-3'>
				<Plus />
				Add Collaborators
			</SheetTrigger>
			<SheetContent className='w-[400px] sm:w-[540px]'>
				<SheetHeader>
					<SheetTitle>Search Collaborator</SheetTitle>
					<SheetDescription className='text-sm text-muted-foreground'>
						You can also remove collaborators after adding them from the
						settings tab.
					</SheetDescription>
				</SheetHeader>
				<div className='flex justify-center items-center gap-2 mt-2'>
					<Search />
					<Input
						name='email'
						className='dark:bg-background'
						placeholder='Email'
						onChange={onChange}
					/>
				</div>
				<ScrollArea className='mt-6 w-full rounded-md'>
					{searchUsers
						.filter((user) => !existsCollaboratorIdsSet.has(user.id))
						.filter((user) => user.id !== authUser?.id)
						.map((user) => (
							<div
								key={user.id}
								className='p-4 flex justify-between items-center'
							>
								<div className='flex gap-4 items-center'>
									<Avatar className='w-8 h-8'>
										<AvatarImage src='/avatars/7.png' />
										<AvatarFallback>CP</AvatarFallback>
									</Avatar>
									<div className='text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground'>
										{user.email}
									</div>
								</div>
								<Button
									variant='secondary'
									onClick={() => addCollaborator(user)}
								>
									Add
								</Button>
							</div>
						))}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

export default CollaboratorSearch;

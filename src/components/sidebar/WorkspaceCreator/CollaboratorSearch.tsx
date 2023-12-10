'use client';
import type { UserType } from '@/lib/supabase/types';
import { Search } from 'lucide-react';
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
	existingCollaboratorIds: string[];
	getCollaborator: (collaborator: UserType) => void;
}>;

const CollaboratorSearch = ({
	children,
	existingCollaboratorIds,
	getCollaborator,
}: Props) => {
	const {
		store: { user },
	} = useUser();
	const [searchUsers, setSearchUsers] = useState<UserType[]>([]);
	const [email, setEmail] = useState('');
	const deferredEmail = useDeferredValue(email);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.currentTarget.value);
	};

	const addCollaborator = (user: UserType) => {
		getCollaborator(user);
	};

	useEffect(() => {
		if (!deferredEmail) return;
		(async () => {
			const { users } = await getUsersByEmail(deferredEmail);
			if (users) setSearchUsers(users);
		})();
	}, [deferredEmail]);

	return (
		<Sheet>
			<SheetTrigger className='mx-auto block'>{children}</SheetTrigger>
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
						.filter((user) => !existingCollaboratorIds.includes(user.id))
						.filter((user) => user.id !== user?.id)
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

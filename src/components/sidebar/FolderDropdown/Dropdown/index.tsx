'use client';
import type { AuthUser } from '@supabase/supabase-js';
import type { FileType } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { PlusIcon, Trash } from 'lucide-react';
import { useMemo, useState, type FocusEvent } from 'react';
import { cn } from '@/lib/utils';
import EmojiPicker from '@/components/global/EmojiPicker';
import Tooltip from '@/components/global/Tooltip';
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { getStyles } from './getStyle';
import useInit from './use-init';

type Props = {
	type: 'folder' | 'file';
	user: AuthUser;
	mainId: string;
	ids: string[];
	title: string;
	iconId: string;
	files?: FileType[];
};

const Dropdown = ({ type, user, mainId, ids, title, iconId, files }: Props) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const { onUpdateTitle, onUpdateEmoji, onMoveToTrash, createNewFile } =
		useInit({ ids, type, user });
	const onDoubleClick = () => setIsEditing(true);
	const onBlur = async (e: FocusEvent<HTMLInputElement>) => {
		if (!isEditing) return;
		setIsEditing(false);
		if (!e.currentTarget?.value) return;
		if (e.currentTarget.value === title) return;
		onUpdateTitle(e.currentTarget.value);
	};
	const { groupIdentifies, listStyles, hoverStyles } = useMemo(
		() => getStyles(type),
		[type],
	);

	return (
		<AccordionItem
			value={mainId}
			className={listStyles}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				router.push(`/dashboard/${ids.join('/')}`);
			}}
		>
			<AccordionTrigger
				id={type}
				disabled={type === 'file'}
				className='hover:no-underline p-2 dark:text-muted-foreground text-sm'
			>
				<div className={groupIdentifies}>
					<div className='flex gap-4 items-center justify-center overflow-hidden'>
						<div className='relative'>
							<EmojiPicker
								onChange={(updatedEmoji) => {
									updatedEmoji !== iconId && onUpdateEmoji(updatedEmoji);
								}}
							>
								{iconId}
							</EmojiPicker>
						</div>
						<input
							type='text'
							defaultValue={title}
							className={cn(
								'outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',
								{
									'bg-muted cursor-text': isEditing,
									'bg-transparent cursor-pointer': !isEditing,
								},
							)}
							readOnly={!isEditing}
							onDoubleClick={onDoubleClick}
							onBlur={onBlur}
						/>
					</div>
					<div className={hoverStyles}>
						<Tooltip message='Delete Folder'>
							<Trash
								onClick={onMoveToTrash}
								size={16}
								className='hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors'
							/>
						</Tooltip>
						{type === 'folder' && !isEditing && (
							<Tooltip message='Add File'>
								<PlusIcon
									onClick={createNewFile}
									size={16}
									className='hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors'
								/>
							</Tooltip>
						)}
					</div>
				</div>
			</AccordionTrigger>
			<AccordionContent>
				{files?.map((file) => (
					<Dropdown
						key={file.id}
						type='file'
						user={user}
						mainId={file.id}
						ids={[...ids, file.id]}
						title={file.title}
						iconId={file.iconId}
					/>
				))}
			</AccordionContent>
		</AccordionItem>
	);
};

export default Dropdown;

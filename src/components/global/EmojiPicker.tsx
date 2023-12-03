'use client';
import dynamic from 'next/dynamic';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
	children: React.ReactNode;
	onChange?: (emoji: string) => void;
};

const Picker = dynamic(() => import('emoji-picker-react'));
const EmojiPicker = ({ children, onChange }: Props) => {
	const onClick = (selectedEmoji: any) => {
		if (onChange) onChange(selectedEmoji.emoji);
	};

	return (
		<div className='flex items-center'>
			<Popover>
				<PopoverTrigger className='cursor-pointer'>{children}</PopoverTrigger>
				<PopoverContent className='p-0 border-none'>
					<Picker onEmojiClick={onClick} />
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default EmojiPicker;

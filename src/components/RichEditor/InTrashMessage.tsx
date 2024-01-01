import { Button } from '@/components/ui/button';

type Props = {
	type: 'workspace' | 'folder' | 'file';
	message: string;
	onRestore: () => void;
	onRemove: () => void;
};

const InTrashMessage = ({ type, message, onRestore, onRemove }: Props) => {
	return (
		<article className='py-2 z-40 bg-peach-500 flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap'>
			<div className='flex flex-col md:flex-row gap-2 justify-center items-center'>
				<span className='text-white'>This {type} is in the trash.</span>
				<Button
					size='sm'
					variant='outline'
					className='bg-transparent border-white text-white hover:bg-white hover:text-peach-500'
					onClick={onRestore}
				>
					Restore
				</Button>
				<Button
					size='sm'
					variant='outline'
					className='bg-transparent border-white text-white hover:bg-white hover:text-peach-500'
					onClick={onRemove}
				>
					Delete
				</Button>
			</div>
			<span className='text-sm text-white'>{message}</span>
		</article>
	);
};

export default InTrashMessage;

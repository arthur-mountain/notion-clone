'use client';
import type { Quill } from 'quill';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import useInit, { type Props } from './use-init';
import Editor from './Editor';

const RichEditor = ({ id, type, data }: Props) => {
	const {
		store: { storeData },
		action,
	} = useInit({ id, type, data });
	const router = useRouter();
	const pathname = usePathname();
	const [quillIns, setQuillIns] = useState<Quill>();
	console.log(`🚀 ~ RichEditor ~ quillIns:`, quillIns);
	if (!storeData) return null;
	console.log(`🚀 ~ RichEditor ~ storeData:`, storeData);

	return (
		<>
			{storeData.inTrash && (
				<article className='py-2 z-40 bg-peach-500 flex  md:flex-row flex-col justify-center items-center gap-4 flex-wrap'>
					<div className='flex flex-col md:flex-row gap-2 justify-center items-center'>
						<span className='text-white'>This {type} is in the trash.</span>
						<Button
							size='sm'
							variant='outline'
							className='bg-transparent border-white text-white hover:bg-white hover:text-peach-500'
							onClick={action.restore}
						>
							Restore
						</Button>
						<Button
							size='sm'
							variant='outline'
							className='bg-transparent border-white text-white hover:bg-white hover:text-peach-500'
							onClick={action.remove}
						>
							Delete
						</Button>
					</div>
					<span className='text-sm text-white'>{storeData.inTrash}</span>
				</article>
			)}
			<Editor setQuillIns={setQuillIns} />
		</>
	);
};

export default RichEditor;

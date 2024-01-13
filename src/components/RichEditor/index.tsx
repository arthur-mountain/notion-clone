'use client';
import type { Quill } from 'quill';
import { useState } from 'react';
import useRealtimeSocket from './use-realtime-socket';
import useInit, { type Props } from './use-init';
import EmojiPicker from '@/components/Global/EmojiPicker';
import InTrashMessage from './InTrashMessage';
import RealtimeCollaborators from './RealtimeCollaborators';
import BannerImage from './BannerImage';
import BannerUpload from './BannerUpload';
import Editor from './Editor';

const RichEditor = ({ id, type, data }: Props) => {
	const [quillIns, setQuillIns] = useState<Quill>();
	const {
		store: { storeData, breadCrumbs },
		action,
	} = useInit({ id, type, data });
	const {
		store: { isConnected, isSaving, collaborators },
	} = useRealtimeSocket({ id, type, quillIns });

	if (!storeData) return null;

	return (
		<>
			{isConnected ? 'connected' : 'not connected'}
			{storeData.inTrash && (
				<InTrashMessage
					type={type}
					message={storeData.inTrash}
					onRestore={action.restore}
					onRemove={action.remove}
				/>
			)}
			<div className='flex flex-col-reverse sm:flex-row sm:justify-between justify-center sm:items-center sm:p-2 p-8 gap-2'>
				<div>{breadCrumbs}</div>
				<RealtimeCollaborators
					collaborators={collaborators}
					isSaving={isSaving}
				/>
			</div>

			{storeData.bannerUrl && <BannerImage bannerUrl={storeData.bannerUrl} />}

			<div className='max-w-[800px] mx-auto px-7 md:px-0 lg:my-8 flex flex-col gap-2'>
				<div className='text-[80px]'>
					<EmojiPicker onChange={action.changeIcon}>
						<div className='w-[100px] cursor-pointer transition-colors h-[100px] flex items-center justify-center hover:bg-muted rounded-xl'>
							{storeData.iconId}
						</div>
					</EmojiPicker>
				</div>

				<BannerUpload
					id={id}
					type={type}
					bannerUrl={storeData.bannerUrl}
					onRemoveBanner={action.removeBanner}
				/>

				<div className='text-muted-foreground text-3xl font-bold'>
					{storeData.title}
				</div>
				<div className='text-muted-foreground text-sm'>
					{type.toUpperCase()}
				</div>

				<Editor key='rich-editor' setQuillIns={setQuillIns} />
			</div>
		</>
	);
};

export default RichEditor;

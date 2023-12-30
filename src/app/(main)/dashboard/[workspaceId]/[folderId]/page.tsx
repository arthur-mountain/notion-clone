import { redirect } from 'next/navigation';
import React from 'react';
import { getFolderById } from '@/lib/supabase/schemas/folders/queries';
import RichEditor from '@/components/RichEditor';

export const dynamic = 'force-dynamic';

const FolderPage = async ({ params }: { params: { folderId: string } }) => {
	const { data: folder, error } = await getFolderById(params.folderId);
	if (error || !folder) redirect('/dashboard');

	return (
		<div className='relative'>
			<RichEditor type='folder' id={params.folderId} data={folder} />
		</div>
	);
};

export default FolderPage;

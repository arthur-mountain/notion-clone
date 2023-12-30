import { redirect } from 'next/navigation';
import React from 'react';
import { getFileById } from '@/lib/supabase/schemas/files/queries';
import RichEditor from '@/components/RichEditor';

export const dynamic = 'force-dynamic';

const FilePage = async ({ params }: { params: { fileId: string } }) => {
	const { data: file, error } = await getFileById(params.fileId);
	if (error || !file) redirect('/dashboard');

	return (
		<div className='relative'>
			<RichEditor type='file' id={params.fileId} data={file} />
		</div>
	);
};

export default FilePage;

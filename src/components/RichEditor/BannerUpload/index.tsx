import { XCircleIcon } from 'lucide-react';
import CustomDialog from '@/components/Global/CustomDialog';
import { Button } from '@/components/ui/button';
import BannerUploadForm from './BannerUploadForm';
import { useState } from 'react';

type Props = {
	id: string;
	type: 'workspace' | 'folder' | 'file';
	bannerUrl: string | null;
	onRemoveBanner: () => void;
};

const BannerUpload = ({ id, type, bannerUrl, onRemoveBanner }: Props) => {
	const [isDeleting, setIsDeleting] = useState(false);

	return (
		<div className='flex items-center gap-2'>
			<CustomDialog
				header='Upload Banner'
				content={<BannerUploadForm id={id} type={type} />}
			>
				{bannerUrl ? 'Update Banner' : 'Add Banner'}
			</CustomDialog>
			{bannerUrl && (
				<Button
					disabled={isDeleting}
					onClick={async () => {
						setIsDeleting(true);
						await onRemoveBanner();
						setIsDeleting(false);
					}}
					variant='ghost'
					className='hover:bg-background flex item-center justify-center gap-1 text-sm text-muted-foreground rounded-md p-0'
				>
					<XCircleIcon size={16} />
					<span className='whitespace-nowrap font-normal'>Remove Banner</span>
				</Button>
			)}
		</div>
	);
};
export default BannerUpload;

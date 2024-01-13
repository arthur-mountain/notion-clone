import Image from 'next/image';
import { getStoragePublicUrl } from '@/lib/supabase/utils/client/storage-urls';

type Props = {
	bannerUrl: string;
};

const BannerImage = ({ bannerUrl }: Props) => {
	return (
		<div className='relative h-[200px]'>
			<Image
				src={getStoragePublicUrl('file-banners', bannerUrl)}
				fill
				className='md:h-48 h-20 object-cover'
				alt='Editor Banner Image'
			/>
		</div>
	);
};

export default BannerImage;

import Image from 'next/image';
import { createClientComponentClient } from '@/lib/supabase/utils/client';

type Props = {
	bannerUrl: string;
};

const BannerImage = ({ bannerUrl }: Props) => {
	return (
		<div className='relative h-[200px]'>
			<Image
				src={
					createClientComponentClient()
						.storage.from('file-banners')
						.getPublicUrl(bannerUrl).data.publicUrl
				}
				fill
				className='md:h-48 h-20 object-cover'
				alt='Editor Banner Image'
			/>
		</div>
	);
};

export default BannerImage;

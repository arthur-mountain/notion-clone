import type { PropsWithChildren } from 'react';

const Template = ({ children }: PropsWithChildren) => {
	return <div className='h-screen p-6 flex justify-center'>{children}</div>;
};

export default Template;

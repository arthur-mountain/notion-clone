import React, { type PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
	params: any;
}>;

const DashboardLayout = ({ children }: Props) => {
	return <main>{children}</main>;
};

export default DashboardLayout;

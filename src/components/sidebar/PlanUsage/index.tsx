'use client';
import type { SubscriptionType } from '@/lib/supabase/types';
import { DiamondIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MAX_FOLDERS_FREE_PLAN } from '@/constants/common';
import { useAppStore } from '@/components/providers/AppProvider';
import { Progress } from '@/components/ui/progress';

type Props = {
	foldersLength: number;
	subscription: SubscriptionType | null;
};

const getUsagePercentage = (num: number) => (num / MAX_FOLDERS_FREE_PLAN) * 100;
const PlanUsage = ({ foldersLength, subscription }: Props) => {
	const {
		store: { currentWorkspace },
	} = useAppStore();
	const [usagePercentage, setUsagePercentage] = useState(
		getUsagePercentage(foldersLength),
	);

	useEffect(() => {
		if (!currentWorkspace) return;
		setUsagePercentage(getUsagePercentage(currentWorkspace?.folders?.length));
	}, [currentWorkspace]);

	return (
		<article className='mb-4'>
			{subscription?.status !== 'active' && (
				<div className='flex justify-between items-center text-muted-foreground mb-2'>
					<div className='flex items-center gap-2'>
						<DiamondIcon size={16} />
						<span>Free Plan</span>
					</div>
					<small>{usagePercentage.toFixed(0)}% / 100%</small>
				</div>
			)}
			{subscription?.status !== 'active' && (
				<Progress value={usagePercentage} className='h-1' />
			)}
		</article>
	);
};

export default PlanUsage;

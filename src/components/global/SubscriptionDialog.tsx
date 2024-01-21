'use client';
import type { PriceType, ProductWithPriceType } from '@/lib/supabase/types';
import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/components/Providers/UserProvider';
import Loader from './Loader';

type Props = {
	products: ProductWithPriceType[];
};

const SubscriptionModal = ({ products }: Props) => {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const {
		store: { user, subscription, isSubscriptionModalOpen },
		action: { toggleSubscriptionDialog },
	} = useUser();

	const onClickContinue = async (price: PriceType) => {
		try {
			setIsLoading(true);
			if (!user) {
				toast({ title: 'You must be logged in' });
				setIsLoading(false);
				return;
			}
			if (subscription) {
				toast({ title: 'Already on a paid plan' });
				setIsLoading(false);
				return;
			}
		} catch (error) {
			toast({ title: 'Oppse! Something went wrong.', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	if (subscription?.status === 'active') {
		return (
			<Dialog
				open={isSubscriptionModalOpen}
				onOpenChange={toggleSubscriptionDialog}
			>
				<DialogContent>Already on a paid plan!</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog
			open={isSubscriptionModalOpen}
			onOpenChange={toggleSubscriptionDialog}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upgrade to a Pro Plan</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					To access Pro features you need to have a paid plan.
				</DialogDescription>
				{products?.map((product) => (
					<div
						className='
                  flex
                  justify-between
                  items-center
                  '
						key={product.id}
					>
						{/* FIXME: without any type */}
						{product.prices?.map((price: any) => (
							<React.Fragment key={price.id}>
								<b className='text-3xl text-foreground'>
									{price} / <small>{price.interval}</small>
								</b>
								<Button
									onClick={() => onClickContinue(price)}
									disabled={isLoading}
								>
									{isLoading ? <Loader /> : 'Upgrade ✨'}
								</Button>
							</React.Fragment>
						))}
					</div>
				))}
			</DialogContent>
		</Dialog>
	);
};

export default SubscriptionModal;

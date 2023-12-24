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
/** FIXME: implement below those three func */
import { postData } from '@/services/postData';
import { formatPrice } from '@/lib/utils/formatter/format-price';
import { getStripe } from '@/lib/utils/stripe';
/** FIXME: implement upper those three func */
import { useUser } from '@/components/providers/UserProvider';
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
			const { sessionId } = await postData({
				url: '/api/create-checkout-session',
				data: { price },
			});

			(await getStripe())?.redirectToCheckout({ sessionId });
		} catch (error) {
			toast({ title: 'Oppse! Something went wrong.', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	// WIP
	return null;

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
									{formatPrice(price)} / <small>{price.interval}</small>
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

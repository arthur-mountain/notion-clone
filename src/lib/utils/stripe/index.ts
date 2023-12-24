export const getStripe = async () => {
	return {
		redirectToCheckout: ({ sessionId }: { sessionId: string }) => {},
	};
};

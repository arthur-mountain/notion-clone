import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { CLIENTS, USERS } from '@/constants/common';

import TitleSection from '@/components/landing-page/TitleSection';
import { Button } from '@/components/ui/button';

const HomePage = () => {
	return (
		<>
			<section className='overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:items-center md:justify-center'>
				<TitleSection
					title='All-In-One Collaboration and Productivity Platform'
					pill='❤️‍🔥 Your Workspaces, Perfected'
				/>
				<div className='bg-white p-[2px] mt-6 rounded-xl bg-gradient-to-r from-primary to-brand-primaryBlue sm:w-[300px]'>
					<Button
						variant='secondary'
						className=' w-full
            rounded-[10px]
            p-6
            text-2xl
            bg-background
          '
					>
						Get Cypress Free
					</Button>
				</div>
				<div className='md:mt-[-90px] sm:w-full w-[750px] h-[450px] flex justify-center items-center mt-[-40px] relative sm:ml-0 ml-[-50px]'>
					<Image
						src='/appBanner.png'
						fill
						alt='Application Banner'
						className='w-full h-full'
					/>
					<div className='bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10'></div>
				</div>
			</section>
			<section className='relative'>
				<div
					className={cn(
						'overflow-hidden flex',

						'after:content[""] after:dark:from-brand-dark after:to-transparent after:from-background after:bg-gradient-to-l after:right-0 after:bottom-0 after:top-0 after:w-20 after:z-10 after:absolute',

						'before:content[""] before:dark:from-brand-dark before:to-transparent before:from-background before:bg-gradient-to-r before:left-0 before:top-0 before:bottom-0 before:w-20 before:z-10 before:absolute',
					)}
				>
					{Array.from({ length: 2 }, (_, i) => (
						<div key={i} className='flex flex-nowrap animate-slide'>
							{CLIENTS.map((client) => (
								<div
									key={client.alt}
									className='relative w-[200px] m-20 shrink-0 flex items-center'
								>
									<Image
										src={client.logo}
										alt={client.alt}
										width={200}
										height={100}
										className='object-contain max-w-none'
									/>
								</div>
							))}
						</div>
					))}
				</div>
			</section>
			<section className='px-4 sm:px-6 flex justify-center items-center flex-col relative'>
				<div className='w-[30%] blur-[120px] rounded-full h-32 absolute bg-brand-primaryPurple/50 -z-10 top-22' />
				<TitleSection
					title='Keep track of your meetings all in one place'
					subheading='Capture your ideas, thoughts, and meeting notes in a structured and organized manner.'
					pill='Features'
				/>
				<div className='w-full h-[450px] mt-10 max-w-[450px] flex  justify-center items-center relative sm:ml-0 rounded-2xl border-8  border-washed-purple-300 border-opacity-10'>
					<Image src='/cal.png' alt='Banner' fill className='rounded-2xl' />
				</div>
			</section>
			<section className='relative'>
				<div className='w-full blur-[120px] rounded-full h-32 absolute bg-brand-primaryPurple/50 -z-100 top-56' />
				<div className='mt-20 px-4 sm:px-6  flex flex-col overflow-x-hidden overflow-visible'>
					<TitleSection
						title='Trusted by all'
						subheading='Join thousands of satisfied users who rely on our platform for their 
            personal and professional productivity needs.'
						pill='Testimonials'
					/>
					{Array.from({ length: 2 }, (_, index) => (
						<div
							key={crypto.randomUUID()}
							className={cn(
								'mt-10 flex flex-nowrap gap-6 self-start hover:paused',
								'animate-[slide_250s_linear_infinite]',
								{
									'flex-row-reverse': index === 1,
									'animate-[slide_250s_linear_infinite_reverse]': index === 1,
									'ml-[100vw]': index === 1,
								},
							)}
						>
							{USERS.map((testimonial, index) => (
								<div key={testimonial.name}>{testimonial.name}</div>
								// <CustomCard
								// 	key={testimonial.name}
								// 	className='w-[500px]
								//   shrink-0s
								//   rounded-xl
								//   dark:bg-gradient-to-t
								//   dark:from-border dark:to-background
								// '
								// 	cardHeader={
								// 		<div
								// 			className='flex
								//       items-center
								//       gap-4
								//   '
								// 		>
								// 			<Avatar>
								// 				<AvatarImage src={`/avatars/${index + 1}.png`} />
								// 				<AvatarFallback>AV</AvatarFallback>
								// 			</Avatar>
								// 			<div>
								// 				<CardTitle className='text-foreground'>
								// 					{testimonial.name}
								// 				</CardTitle>
								// 				<CardDescription className='dark:text-washed-purple-800'>
								// 					{testimonial.name.toLocaleLowerCase()}
								// 				</CardDescription>
								// 			</div>
								// 		</div>
								// 	}
								// 	cardContent={
								// 		<p className='dark:text-washed-purple-800'>
								// 			{testimonial.message}
								// 		</p>
								// 	}
								// />
							))}
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default HomePage;

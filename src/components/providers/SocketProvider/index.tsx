'use client';
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { io as ClientIO, type Socket } from 'socket.io-client';

type SocketContextType = {
	socket: Socket | null;
	isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => useContext(SocketContext);
type Props = PropsWithChildren;
export const SocketProvider = ({ children }: Props) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const socketInstance = new (ClientIO as any)(
			process.env.NEXT_PUBLIC_SITE_URL,
			{ path: process.env.NEXT_PUBLIC_SOCKET_API_URL, addTrailingSlash: false },
		);

		console.log(process.env.NEXT_PUBLIC_SOCKET_API_URL);
		

		socketInstance.on('connect', () => {
			setIsConnected(true);
		});

		socketInstance.on('disconnect', () => {
			setIsConnected(false);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

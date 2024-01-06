import { Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

type NextApiResponseServerIo = NextApiResponse & {
	socket: Socket & {
		server: HttpServer & {
			io: SocketIOServer;
		};
	};
};

const GET = (_req: NextApiRequest, res: NextApiResponseServerIo) => {
	try {
		if (!res.socket.server.io) {
			const io = new SocketIOServer(res.socket.server, {
				path: process.env.SOCKET_API_URL,
				addTrailingSlash: false,
			});
			io.on('connection', (s) => {
				s.on('create-room', (fileId) => {
					console.log('CREATE ROOM');
					s.join(fileId);
				});
				s.on('send-changes', (deltas, fileId) => {
					console.log('CHANGE');
					s.to(fileId).emit('receive-changes', deltas, fileId);
				});
				s.on('send-cursor-move', (range, fileId, cursorId) => {
					console.log('CURSOR MOVE');
					s.to(fileId).emit('receive-cursor-move', range, fileId, cursorId);
				});
			});
			res.socket.server.io = io;
		}
	} catch (err) {
		console.log(`🚀 ~ GET ~ err:`, err);
	} finally {
		res.end();
	}
};

export default GET;

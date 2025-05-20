import { createServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { Socket } from 'net';
import { initSocket } from '@/lib/socket';

const server = createServer();
const io = initSocket(server);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { socket, head } = req;
    io.engine.handleUpgrade(req, socket as Socket, head as Buffer);
    res.end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

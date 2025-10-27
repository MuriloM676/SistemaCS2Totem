import { NextApiRequest } from 'next';
import { NextApiResponseServerIO, initSocketIO } from '@/lib/socket';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === 'GET') {
    initSocketIO(res);
    res.status(200).json({ message: 'Socket.IO inicializado' });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let type = (req.query.type as string) || 'mining';
  let phase = (req.query.phase as string) || 'before';

  if (!['mining', 'deforestation', 'construction', 'sandmining', 'wetland'].includes(type)) {
    type = 'mining';
  }
  if (!['before', 'after', 'mask'].includes(phase)) {
    phase = 'before';
  }

  const filePath = path.join(process.cwd(), 'public', 'images', 'satellite', `${type}_${phase}.png`);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(fileBuffer);
  }

  res.status(404).json({ error: 'Satellite image not found' });
}

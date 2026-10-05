import {Request, Response, NextFunction} from 'express';
import fs from 'fs';
import fetchData from '../../lib/fetchData';

type ImageResponse = {
  data: {
    b64_json: string;
  }[];
};

const imagePost = async (
  req: Request<{}, {}, {prompt: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = `${process.env.OPENAI_API_URL}/v1/images/generations`;

    const data = await fetchData<ImageResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: req.body.prompt,
        size: '1024x1024',
      }),
    });

    const image = Buffer.from(data.data[0].b64_json, 'base64');

    fs.writeFileSync('output.png', image);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export {imagePost};
import fetchData from '../../lib/fetchData';
import { Request, Response, NextFunction } from 'express';

type ChatCompletionResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

const commentPost = async (
  req: Request<{}, {}, { text: string }>,
  res: Response<{ response: string }>,
  next: NextFunction
) => {
  try {
        const url = `${process.env.OPENAI_API_URL}/v1/chat/completions`;

        console.log('OPENAI_API_URL:', process.env.OPENAI_API_URL);
        console.log('Request URL:', url);

        const data = await fetchData<ChatCompletionResponse>(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'Generate a friendly response to a YouTube comment.',
              },
              {
                role: 'user',
                content: req.body.text,
              }
            ],
          }),
        });

        res.json({ response: data.choices[0].message.content, 
        });
  } catch (error) {
    next(error);
  }
};

export { commentPost };
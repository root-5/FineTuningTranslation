import { NextApiRequest, NextApiResponse } from 'next';
import { Langchain } from 'langchain';
import { GPT4Turbo } from 'gpt-4-turbo';

const langchain = new Langchain();
const model = new GPT4Turbo();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;

    // 入力されたテキストが存在しない場合はエラーレスポンスを返す
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    try {
      // Langchainを使用してテキストを翻訳する
      const translatedText = await langchain.translate(text, model);
      // 翻訳されたテキストをレスポンスとして返す
      return res.status(200).json({ translatedText });
    } catch (error) {
      // 翻訳中にエラーが発生した場合はエラーレスポンスを返す
      return res.status(500).json({ error: 'Translation failed' });
    }
  } else {
    // POSTメソッド以外のリクエストが来た場合は405エラーレスポンスを返す
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

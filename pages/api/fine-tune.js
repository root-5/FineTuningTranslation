import { NextApiRequest, NextApiResponse } from 'next';
import { Langchain } from 'langchain';
import { GPT4Turbo } from 'gpt-4-turbo';

const langchain = new Langchain();
const model = new GPT4Turbo();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const samples = req.body;

    // サンプルが存在しない、または配列でない、または空の場合はエラーレスポンスを返す
    if (!samples || !Array.isArray(samples) || samples.length === 0) {
      return res.status(400).json({ error: 'Samples are required' });
    }

    try {
      // 各サンプルに対してファインチューニングを実行
      const fineTuningResults = await Promise.all(samples.map(async (sample) => {
        const { originalText, translatedText } = sample;
        // 原文と訳文が存在しない場合はエラーを投げる
        if (!originalText || !translatedText) {
          throw new Error('Original text and translated text are required for each sample');
        }
        // Langchainを使用してモデルをファインチューニング
        return await langchain.fineTune(model, originalText, translatedText);
      }));
      // ファインチューニング結果をレスポンスとして返す
      return res.status(200).json({ fineTuningResults });
    } catch (error) {
      // ファインチューニング中にエラーが発生した場合はエラーレスポンスを返す
      return res.status(500).json({ error: 'Fine-tuning failed' });
    }
  } else {
    // POSTメソッド以外のリクエストが来た場合は405エラーレスポンスを返す
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

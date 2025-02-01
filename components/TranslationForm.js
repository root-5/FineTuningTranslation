import { useState } from 'react';

export default function TranslationForm() {
  // サンプルの状態を管理するための useState フック
  const [samples, setSamples] = useState([{ originalText: '', translatedText: '' }]);

  // サンプルのテキストを変更する関数
  const handleSampleChange = (index, field, value) => {
    const newSamples = [...samples];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  // 新しいサンプルを追加する関数
  const addSample = () => {
    setSamples([...samples, { originalText: '', translatedText: '' }]);
  };

  // フォームの送信を処理する関数
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // fetch を使用して API にリクエストを送信
      const response = await fetch('/api/fine-tune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(samples),
      });
      const data = await response.json();
      console.log('Fine-tuning result:', data);
    } catch (error) {
      console.error('Error during fine-tuning:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {samples.map((sample, index) => (
        <div key={index}>
          <div>
            <label htmlFor={`originalText-${index}`}>Original Text:</label>
            <textarea
              id={`originalText-${index}`}
              value={sample.originalText}
              onChange={(e) => handleSampleChange(index, 'originalText', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`translatedText-${index}`}>Translated Text:</label>
            <textarea
              id={`translatedText-${index}`}
              value={sample.translatedText}
              onChange={(e) => handleSampleChange(index, 'translatedText', e.target.value)}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addSample}>Add Another Sample</button>
      <button type="submit">Submit for Fine-Tuning</button>
    </form>
  );
}

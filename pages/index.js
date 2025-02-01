import { useState } from 'react';

export default function Home() {
  const [samples, setSamples] = useState([{ originalText: '', translatedText: '' }]);
  const [fineTuningResult, setFineTuningResult] = useState(null);

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
      const response = await fetch('/api/fine-tune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(samples),
      });
      const data = await response.json();
      setFineTuningResult(data);
    } catch (error) {
      console.error('Error during fine-tuning:', error);
    }
  };

  return (
    <div>
      <h1>Translation Fine-Tuning</h1>
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
      {fineTuningResult && (
        <div>
          <h2>Fine-Tuning Result</h2>
          <pre>{JSON.stringify(fineTuningResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

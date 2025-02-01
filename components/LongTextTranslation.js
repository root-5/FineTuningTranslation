import { useState } from 'react';

export default function LongTextTranslation() {
  // 長文の状態を管理するための useState フック
  const [longText, setLongText] = useState('');
  // 翻訳されたテキストの状態を管理するための useState フック
  const [translatedText, setTranslatedText] = useState('');

  // フォームの送信を処理する関数
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // fetch を使用して API にリクエストを送信
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: longText,
        }),
      });
      const data = await response.json();
      // 翻訳されたテキストを状態に設定
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Error during translation:', error);
    }
  };

  return (
    <div>
      <h1>Long Text Translation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="longText">Long Text:</label>
          <textarea
            id="longText"
            value={longText}
            onChange={(e) => setLongText(e.target.value)}
          />
        </div>
        <button type="submit">Submit for Translation</button>
      </form>
      {translatedText && (
        <div>
          <h2>Translated Text</h2>
          <pre>{translatedText}</pre>
        </div>
      )}
    </div>
  );
}

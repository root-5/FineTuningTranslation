import React from 'react';

// エラーメッセージを表示するコンポーネント
export default function ErrorDisplay({ error }) {
  if (!error) return null;

  return (
    <div style={{ color: 'red' }}>
      <h2>エラーが発生しました</h2>
      <p>{error}</p>
    </div>
  );
}

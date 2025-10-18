import React from 'react';

interface CodeDisplayProps {
  title: string;
  code: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ title, code }) => {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {code}
      </pre>
    </div>
  );
};

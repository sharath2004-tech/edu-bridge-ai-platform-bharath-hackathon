'use client';

import { AIAnalysis } from '@/types/lab';
import { Card } from '@/components/ui/card';

interface Props {
  analysis: AIAnalysis;
}

export default function AIFeedback({ analysis }: Props) {
  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <h3 className="text-lg font-semibold">AI Analysis</h3>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-gray-600 mb-1">Feedback</h4>
        <p className="text-gray-800">{analysis.feedback}</p>
      </div>

      {analysis.mistakesDetected.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm text-red-600 mb-2">⚠️ Common Mistakes Detected</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.mistakesDetected.map((mistake, i) => (
              <li key={i} className="text-sm text-gray-700">{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-sm text-gray-600 mb-2">📚 Viva Questions</h4>
        <ol className="list-decimal list-inside space-y-2">
          {analysis.vivaQuestions.map((q, i) => (
            <li key={i} className="text-sm text-gray-800">{q}</li>
          ))}
        </ol>
      </div>

      <div className="p-3 bg-blue-100 rounded">
        <h4 className="font-semibold text-sm text-blue-800 mb-1">💡 Concept</h4>
        <p className="text-sm text-blue-900">{analysis.conceptExplanation}</p>
      </div>
    </Card>
  );
}

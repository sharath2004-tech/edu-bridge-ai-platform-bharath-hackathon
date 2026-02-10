'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart3, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsChatProps {
  schoolData: any[];
}

export function AnalyticsChat({ schoolData }: AnalyticsChatProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string>('');

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, schoolData }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze data');
      }
      
      const data = await res.json();
      setResponse(data.answer);
      setProvider(data.provider);
    } catch (error) {
      console.error('Error:', error);
      setResponse('❌ Failed to analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    'Which school has the highest overall performance?',
    'What is the average attendance across all schools?',
    'Compare the top 3 performing schools',
    'What percentage of schools have above 80% performance?',
    'Show me trends in student-teacher ratios',
    'Which schools need the most improvement?',
  ];

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold">AI-Powered School Analytics</h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ask questions about school performance, attendance, grades, and more. The AI will analyze your data and provide insights.
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about school analytics..."
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !query.trim()}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Example questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((q, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(q)}
                disabled={loading}
                className="text-xs"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {response && (
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Analysis Result
            </h4>
            {provider && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                Powered by {provider === 'cohere' ? 'Cohere' : 'Groq'}
              </span>
            )}
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{response}</p>
          </div>
        </Card>
      )}

      {schoolData && schoolData.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Current Data Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{schoolData.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Schools</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {schoolData.reduce((sum, s) => sum + (s.totalStudents || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {schoolData.reduce((sum, s) => sum + (s.totalTeachers || 0), 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Teachers</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(
                  schoolData.reduce((sum, s) => sum + (s.performanceScore || 0), 0) / 
                  schoolData.length
                )}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

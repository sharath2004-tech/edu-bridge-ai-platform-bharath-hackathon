'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runSeed = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Database Seeder</h1>
        <p className="text-gray-600 mb-8">
          Click the button below to seed the database with sample data including schools, teachers, students, classes, subjects, exams, marks, and attendance records.
        </p>
        
        <Button 
          onClick={runSeed} 
          disabled={loading}
          size="lg"
          className="mb-8"
        >
          {loading ? 'Seeding Database...' : 'Seed Database'}
        </Button>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {result.error ? '❌ Error' : '✅ Success'}
            </h2>
            <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  )
}

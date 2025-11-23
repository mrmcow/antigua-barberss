"use client";

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('🔍 Testing Supabase connection...');
        
        // Test 1: Simple count query
        const { data, error, count } = await supabase
          .from('barbershops')
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          console.error('❌ Supabase Error:', error);
          setError(error);
        } else {
          console.log('✅ Supabase Success:', { data, count });
          setResult({ data, count });
        }
      } catch (err) {
        console.error('❌ Connection Error:', err);
        setError(err);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Config:</h2>
          <p>URL: https://hntjqndjdfmuzcxbqbva.supabase.co</p>
          <p>Key starts with: eyJhbGciOi...</p>
        </div>

        {error && (
          <div className="bg-red-100 p-4 rounded">
            <h2 className="font-bold text-red-800">❌ ERROR:</h2>
            <pre className="text-sm text-red-700">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {result && (
          <div className="bg-green-100 p-4 rounded">
            <h2 className="font-bold text-green-800">✅ SUCCESS:</h2>
            <p>Found {result.count} barbershops</p>
            <pre className="text-sm text-green-700">{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}

        {!result && !error && (
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-bold text-blue-800">⏳ Testing connection...</h2>
          </div>
        )}
      </div>
    </div>
  );
}

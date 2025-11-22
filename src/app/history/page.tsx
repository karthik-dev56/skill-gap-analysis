'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalysisRecord {
  id: string;
  timestamp: string;
  targetRole: string;
  currentSkills: string;
  skillGapResult: any;
  roadmapResult: any;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/save-analysis');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setAnalyses(data.analyses || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load analysis history');
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Info message for Vercel/production */}
      <div className="container mx-auto px-4 pt-6">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-4 mb-6 text-center">
          <span className="text-yellow-800 dark:text-yellow-200 font-semibold">Note:</span> Analysis history works <b>only in local development</b>. On Vercel or other serverless platforms, history will not be saved or loaded.
        </div>
      </div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analysis History
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Saved analyses from JSON file storage
              </p>
            </div>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Analyses Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by creating your first career path analysis
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Analysis
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-blue-800 dark:text-blue-300">
                ✨ All analyses are saved to <code>data/user-analyses.json</code> file
              </p>
            </div>

            <div className="grid gap-6">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {analysis.targetRole}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(analysis.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                      Saved
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Skills Entered:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {analysis.currentSkills}
                    </p>
                  </div>

                  {analysis.skillGapResult && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Match Percentage
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {analysis.skillGapResult.matchPercentage}%
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Missing Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.skillGapResult.missingSkills?.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {analysis.skillGapResult.missingSkills?.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{analysis.skillGapResult.missingSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Analysis ID: {analysis.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Analyses Saved: <strong>{analyses.length}</strong>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'user-analyses.json');

interface AnalysisRecord {
  id: string;
  timestamp: string;
  targetRole: string;
  currentSkills: string;
  skillGapResult: any;
  roadmapResult: any;
}


async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}


async function readAnalyses(): Promise<AnalysisRecord[]> {
  try {
    await ensureDataDir();
    if (existsSync(DATA_FILE)) {
      const data = await readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading analyses:', error);
    return [];
  }
}


async function writeAnalyses(analyses: AnalysisRecord[]) {
  try {
    await ensureDataDir();
    await writeFile(DATA_FILE, JSON.stringify(analyses, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing analyses:', error);
    throw error;
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetRole, currentSkills, skillGapResult, roadmapResult } = body;

   
    if (!targetRole || !currentSkills) {
      return NextResponse.json(
        { error: 'Target role and current skills are required' },
        { status: 400 }
      );
    }

    
    const analyses = await readAnalyses();

    const now = Date.now();
    const recentDuplicate = analyses.find(a => {
      const timeDiff = now - new Date(a.timestamp).getTime();
      return timeDiff < 5000 && // Within 5 seconds
             a.targetRole === targetRole &&
             a.currentSkills === currentSkills;
    });

    if (recentDuplicate) {
      return NextResponse.json({
        success: true,
        message: 'Analysis already saved (duplicate prevented)',
        id: recentDuplicate.id,
        totalAnalyses: analyses.length,
        isDuplicate: true
      });
    }

    
    const newAnalysis: AnalysisRecord = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      targetRole,
      currentSkills,
      skillGapResult: skillGapResult || null,
      roadmapResult: roadmapResult || null
    };

    
    analyses.push(newAnalysis);

   
    const trimmedAnalyses = analyses.slice(-100);

  
    await writeAnalyses(trimmedAnalyses);

    return NextResponse.json({
      success: true,
      message: 'Analysis saved successfully',
      id: newAnalysis.id,
      totalAnalyses: trimmedAnalyses.length
    });

  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    const analyses = await readAnalyses();

    if (id) {
      
      const analysis = analyses.find(a => a.id === id);
      if (!analysis) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(analysis);
    }

    
    return NextResponse.json({
      analyses: analyses.reverse(),
      count: analyses.length
    });

  } catch (error) {
    console.error('Error retrieving analyses:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analyses' },
      { status: 500 }
    );
  }
}

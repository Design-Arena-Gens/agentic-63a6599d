import { NextRequest, NextResponse } from 'next/server'
import { initiateVideoGeneration } from '@/lib/veo'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, durationSeconds = 6, seed, guidance = 7.5 } = body ?? {}

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const job = await initiateVideoGeneration({
      prompt,
      durationSeconds: Math.min(Math.max(Number(durationSeconds) || 6, 1), 60),
      seed: typeof seed === 'number' ? seed : undefined,
      guidance: typeof guidance === 'number' ? guidance : 7.5,
      width: 7680,
      height: 4320,
      frameRate: 24,
    })

    return NextResponse.json({ jobId: job.jobId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}

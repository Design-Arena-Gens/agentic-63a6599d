import { NextRequest, NextResponse } from 'next/server'
import { checkJobStatus } from '@/lib/veo'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

  try {
    const status = await checkJobStatus(jobId)
    return NextResponse.json(status)
  } catch (e: any) {
    return NextResponse.json({ status: 'failed', error: e?.message || 'Status error' })
  }
}

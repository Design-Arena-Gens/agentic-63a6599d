"use client"

import { useEffect, useState } from 'react'

interface JobStatusResponse {
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  progress?: number
  videoUrl?: string
  error?: string
}

export function VideoResult({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<JobStatusResponse>({ status: 'pending' })

  useEffect(() => {
    let isCancelled = false
    let interval: NodeJS.Timeout

    const poll = async () => {
      try {
        const res = await fetch(`/api/status?jobId=${encodeURIComponent(jobId)}`)
        const data: JobStatusResponse = await res.json()
        if (!isCancelled) setStatus(data)
      } catch (e) {
        if (!isCancelled) setStatus({ status: 'failed', error: 'Polling failed' })
      }
    }

    poll()
    interval = setInterval(poll, 4000)

    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [jobId])

  if (status.status === 'failed') {
    return <div className="rounded-lg border border-white/10 bg-red-950/30 p-4 text-red-200">{status.error || 'Generation failed'}</div>
  }

  if (status.status !== 'succeeded') {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-white/80">Generating video?</p>
          <span className="text-sm text-white/60">{status.status}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-white/10">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${Math.min(98, status.progress ?? 10)}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
        {status.videoUrl ? (
          <video controls playsInline className="h-full w-full" src={status.videoUrl} />
        ) : (
          <div className="p-4 text-white/60">Video ready but no URL provided.</div>
        )}
      </div>
      {status.videoUrl && (
        <div className="flex gap-3">
          <a className="px-4 py-2 text-sm underline" href={status.videoUrl} target="_blank" rel="noreferrer">
            Open video in new tab
          </a>
          <a className="px-4 py-2 text-sm underline" href={status.videoUrl} download>
            Download
          </a>
        </div>
      )}
    </div>
  )
}

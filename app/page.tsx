"use client"

import { useState } from 'react'
import { VideoResult } from '@/components/VideoResult'

export default function Page() {
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState(6)
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [guidance, setGuidance] = useState(7.5)
  const [isLoading, setIsLoading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setJobId(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, durationSeconds: duration, seed, guidance }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start generation')
      setJobId(data.jobId)
    } catch (err: any) {
      setError(err.message || 'Failed to start generation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Veo 3.1 8K AI Video Generator</h1>
        <p className="mt-2 text-white/70">Generate ultra-realistic cinematic videos at 8K resolution (7680?4320).</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-white/80">Prompt</label>
            <textarea
              className="w-full p-3"
              rows={4}
              placeholder="Describe the cinematic scene to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-white/80">Duration (seconds)</label>
              <input
                type="number"
                min={1}
                max={60}
                className="w-full p-2"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/80">Seed (optional)</label>
              <input
                type="number"
                className="w-full p-2"
                value={seed ?? ''}
                placeholder="Random if empty"
                onChange={(e) => setSeed(e.target.value === '' ? undefined : Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/80">Guidance</label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                className="w-full p-2"
                value={guidance}
                onChange={(e) => setGuidance(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="px-4 py-2" disabled={isLoading}>
              {isLoading ? 'Starting?' : 'Generate 8K Video'}
            </button>
            <span className="text-sm text-white/60">Resolution fixed to 8K (7680?4320), 24 fps.</span>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </section>

      <div className="mt-8">
        {jobId && <VideoResult jobId={jobId} />}
      </div>
    </main>
  )
}

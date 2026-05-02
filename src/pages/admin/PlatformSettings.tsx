import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type PlatformKey, type PlatformStatus } from '../../api/admin'

export default function PlatformSettings() {
  const queryClient = useQueryClient()
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-platforms'],
    queryFn: () => adminApi.getPlatforms().then(r => r.data.platforms),
  })

  const { mutate: toggle, isPending } = useMutation({
    mutationFn: (platform: PlatformKey) => adminApi.togglePlatform(platform).then(r => r.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-platforms'] })
      setFeedback({ message: res.message, ok: true })
      setTimeout(() => setFeedback(null), 3000)
    },
    onError: () => {
      setFeedback({ message: 'Something went wrong. Please try again.', ok: false })
      setTimeout(() => setFeedback(null), 3000)
    },
  })

  return (
    <div className="min-h-screen bg-brand-cream p-6">
      <div className="max-w-xl mx-auto">

        <h1 className="font-sans text-2xl font-bold text-brand-navy mb-1">Platform Settings</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enable or disable shipping platforms. Disabled platforms will reject new booking attempts.
        </p>

        {feedback && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
              feedback.ok
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {isLoading && (
          <div className="text-sm text-gray-400 py-8 text-center">Loading platforms…</div>
        )}

        {isError && (
          <div className="text-sm text-red-500 py-8 text-center">
            Failed to load platform settings.
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-4">
            {(Object.entries(data) as [PlatformKey, PlatformStatus][]).map(([key, platform]) => (
              <div
                key={key}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-sans font-semibold text-brand-navy text-base">
                    {platform.label}
                  </p>
                  <p className="text-xs mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium ${
                        platform.enabled ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${
                          platform.enabled ? 'bg-green-500' : 'bg-red-400'
                        }`}
                      />
                      {platform.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => toggle(key)}
                  disabled={isPending}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                    platform.enabled ? 'bg-brand-sky' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={platform.enabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                      platform.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

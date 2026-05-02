import api from './axios'

export type PlatformKey = 'overseas' | 'shiprocket'

export interface PlatformStatus {
  enabled: boolean
  label: string
}

export const adminApi = {
  getPlatforms: () =>
    api.get<{ success: boolean; platforms: Record<PlatformKey, PlatformStatus> }>(
      '/admin/platforms'
    ),

  togglePlatform: (platform: PlatformKey) =>
    api.post<{ success: boolean; message: string; platform: PlatformKey; enabled: boolean }>(
      `/admin/platforms/${platform}/toggle`
    ),
}

/**
 * Local storage utilities for caching prayer times and settings
 * Used as failsafe when API is unavailable
 */

import { CarouselItem } from "types/carousel"
import { MasjidProfileResponse, MasjidSettingsResponse } from "types/masjid"
import { PrayerTimeResponse } from "types/prayer"

const STORAGE_KEYS = {
  PRAYER_TIME: "ptm_prayer_time",
  SETTINGS: "ptm_settings",
  PROFILE: "ptm_profile",
  CAROUSEL: "ptm_carousel",
  LAST_FETCH_TIME: "ptm_last_fetch_time",
}

interface CachedPrayerTime {
  data: PrayerTimeResponse
  timestamp: number
  city: string
  countryCode: string
}

interface CachedSettings {
  data: MasjidSettingsResponse
  timestamp: number
  masjidId: string
}

interface CachedProfile {
  data: MasjidProfileResponse
  timestamp: number
  masjidId: string
}

interface CachedCarousel {
  data: CarouselItem[]
  timestamp: number
  masjidId: string
}

/**
 * Save prayer time to local storage
 */
export const savePrayerTimeToStorage = (
  prayerTime: PrayerTimeResponse,
  city: string,
  countryCode: string
): void => {
  try {
    const cached: CachedPrayerTime = {
      data: prayerTime,
      timestamp: Date.now(),
      city,
      countryCode,
    }
    localStorage.setItem(STORAGE_KEYS.PRAYER_TIME, JSON.stringify(cached))
  } catch (error) {
    console.error("Failed to save prayer time to storage:", error)
  }
}

/**
 * Get prayer time from local storage
 * Returns null if not found or expired (older than 24 hours)
 */
export const getPrayerTimeFromStorage = (
  city: string,
  countryCode: string
): PrayerTimeResponse | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRAYER_TIME)
    if (!stored) return null

    const cached: CachedPrayerTime = JSON.parse(stored)

    // Check if the cached data is for the same city/country
    if (cached.city !== city || cached.countryCode !== countryCode) {
      return null
    }

    // Check if data is less than 24 hours old
    const twentyFourHours = 24 * 60 * 60 * 1000
    if (Date.now() - cached.timestamp > twentyFourHours) {
      return null
    }

    return cached.data
  } catch (error) {
    console.error("Failed to get prayer time from storage:", error)
    return null
  }
}

/**
 * Save settings to local storage
 */
export const saveSettingsToStorage = (
  settings: MasjidSettingsResponse,
  masjidId: string
): void => {
  try {
    const cached: CachedSettings = {
      data: settings,
      timestamp: Date.now(),
      masjidId,
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cached))
  } catch (error) {
    console.error("Failed to save settings to storage:", error)
  }
}

/**
 * Get settings from local storage
 * Returns null if not found
 */
export const getSettingsFromStorage = (
  masjidId: string
): MasjidSettingsResponse | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (!stored) return null

    const cached: CachedSettings = JSON.parse(stored)

    // Check if the cached data is for the same masjid
    if (cached.masjidId !== masjidId) {
      return null
    }

    return cached.data
  } catch (error) {
    console.error("Failed to get settings from storage:", error)
    return null
  }
}

/**
 * Save profile to local storage
 */
export const saveProfileToStorage = (
  profile: MasjidProfileResponse,
  masjidId: string
): void => {
  try {
    const cached: CachedProfile = {
      data: profile,
      timestamp: Date.now(),
      masjidId,
    }
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cached))
  } catch (error) {
    console.error("Failed to save profile to storage:", error)
  }
}

/**
 * Get profile from local storage
 * Returns null if not found
 */
export const getProfileFromStorage = (
  masjidId: string
): MasjidProfileResponse | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE)
    if (!stored) return null

    const cached: CachedProfile = JSON.parse(stored)

    // Check if the cached data is for the same masjid
    if (cached.masjidId !== masjidId) {
      return null
    }

    return cached.data
  } catch (error) {
    console.error("Failed to get profile from storage:", error)
    return null
  }
}

/**
 * Clear all cached data
 */
export const clearAllCache = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRAYER_TIME)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.PROFILE)
    localStorage.removeItem(STORAGE_KEYS.CAROUSEL)
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH_TIME)
  } catch (error) {
    console.error("Failed to clear cache:", error)
  }
}

/**
 * Save carousel items to local storage
 */
export const saveCarouselToStorage = (
  carouselItems: CarouselItem[],
  masjidId: string
): void => {
  try {
    const cached: CachedCarousel = {
      data: carouselItems,
      timestamp: Date.now(),
      masjidId,
    }
    localStorage.setItem(STORAGE_KEYS.CAROUSEL, JSON.stringify(cached))
  } catch (error) {
    console.error("Failed to save carousel to storage:", error)
  }
}

/**
 * Get carousel items from local storage
 * Returns null if not found
 */
export const getCarouselFromStorage = (
  masjidId: string
): CarouselItem[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CAROUSEL)
    if (!stored) return null

    const cached: CachedCarousel = JSON.parse(stored)

    // Check if the cached data is for the same masjid
    if (cached.masjidId !== masjidId) {
      return null
    }

    return cached.data
  } catch (error) {
    console.error("Failed to get carousel from storage:", error)
    return null
  }
}

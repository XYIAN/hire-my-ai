import { UserUsage } from '@/types'

const RESUME_KEY = 'hire-my-ai-resume'
const USAGE_KEY = 'hire-my-ai-usage'
const DAILY_LIMIT = 10

export const storageUtils = {
	// Resume storage
	saveResume: (resume: string): void => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(RESUME_KEY, resume)
		}
	},

	getResume: (): string => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(RESUME_KEY) || ''
		}
		return ''
	},

	// Usage tracking
	getUsage: (): UserUsage => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(USAGE_KEY)
			if (stored) {
				const usage: UserUsage = JSON.parse(stored)
				const today = new Date().toDateString()
				
				// Reset if it's a new day
				if (usage.lastReset !== today) {
					return { dailyCount: 0, lastReset: today }
				}
				return usage
			}
		}
		return { dailyCount: 0, lastReset: new Date().toDateString() }
	},

	incrementUsage: (): boolean => {
		if (typeof window !== 'undefined') {
			const usage = storageUtils.getUsage()
			
			if (usage.dailyCount >= DAILY_LIMIT) {
				return false
			}
			
			usage.dailyCount++
			localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
			return true
		}
		return false
	},

	canGenerate: (): boolean => {
		const usage = storageUtils.getUsage()
		return usage.dailyCount < DAILY_LIMIT
	},

	getRemainingGenerations: (): number => {
		const usage = storageUtils.getUsage()
		return Math.max(0, DAILY_LIMIT - usage.dailyCount)
	}
} 
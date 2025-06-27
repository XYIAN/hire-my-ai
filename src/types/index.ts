export interface ResumeData {
	resume: string
}

export interface JobPostingData {
	jobPosting: string
	tone: 'professional' | 'casual' | 'witty'
}

export interface GenerationRequest {
	resume: string
	jobPosting: string
	tone: 'professional' | 'casual' | 'witty'
}

export interface GenerationResponse {
	content: string
	usage: {
		prompt_tokens: number
		completion_tokens: number
		total_tokens: number
	}
}

export interface UserUsage {
	dailyCount: number
	lastReset: string
}

export interface FormData extends ResumeData, JobPostingData {} 
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { ResumeInput } from '@/components/resume-input'
import { JobPostingInput } from '@/components/job-posting-input'
import { UsageDisplay } from '@/components/usage-display'
import { BuilderPageHeader } from '@/components/builder/page-header'
import { LoadingOverlay } from '@/components/builder/loading-overlay'
import { GenerateButton } from '@/components/builder/generate-button'
import { storageUtils } from '@/utils/storage'
import { FormData, GenerationType } from '@/types'
import { useWizardToast } from '@/hooks/use-wizard-toast'

export default function BuilderPage() {
	const router = useRouter()
	const { success, error: toastError } = useWizardToast()
	const [formData, setFormData] = useState<FormData>({
		resume: '',
		jobPosting: '',
		tone: 'professional',
	})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleResumeChange = useCallback((resume: string) => {
		setFormData(prev => ({ ...prev, resume }))
	}, [])

	const handleJobPostingChange = useCallback(
		(jobData: {
			jobPosting: string
			tone: 'professional' | 'casual' | 'witty'
		}) => {
			setFormData(prev => ({
				...prev,
				jobPosting: jobData.jobPosting,
				tone: jobData.tone,
			}))
		},
		[]
	)

	const generateContent = async (type: GenerationType) => {
		setError('')

		if (!formData.resume.trim() || !formData.jobPosting.trim()) {
			setError('Please fill in both resume and job posting fields.')
			toastError('Please fill in both resume and job posting fields.')
			return
		}

		if (!storageUtils.canGenerate()) {
			setError('Daily limit reached. Please try again tomorrow!')
			toastError(
				'You have reached your daily limit. Please try again tomorrow!'
			)
			return
		}

		setIsLoading(true)

		try {
			const successUsage = storageUtils.incrementUsage()
			if (!successUsage) {
				setError('Daily limit reached. Please try again tomorrow!')
				toastError(
					'You have reached your daily limit. Please try again tomorrow!'
				)
				setIsLoading(false)
				return
			}

			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					type,
				}),
			})

			if (!response.ok) {
				throw new Error('Failed to generate content')
			}

			const result = await response.json()

			const successMessages = {
				'cover-letter': 'Your cover letter has been conjured!',
				'email-response': 'Your email response is ready!',
				outreach: 'Your outreach message has been crafted!',
			}

			success(successMessages[type])
			// Navigate to result page with the generated content
			router.push(`/result?content=${encodeURIComponent(result.content)}`)
		} catch (err) {
			setError('Failed to generate content. Please try again.')
			toastError('The wizard encountered a problem. Please try again!')
			console.error('Generation error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<LoadingOverlay isLoading={isLoading} />

			<div className="min-h-screen bg-gray-50 py-8">
				<div className="container mx-auto px-4 max-w-4xl">
					<BuilderPageHeader
						title="Generate Your Content"
						description="Paste your resume and the job posting to create tailored content."
					/>

					<UsageDisplay />

					<Card className="shadow-lg">
						<form onSubmit={e => e.preventDefault()} className="space-y-6">
							{error && (
								<Message severity="error" text={error} className="w-full" />
							)}

							<ResumeInput
								value={formData.resume}
								onChange={handleResumeChange}
							/>

							<JobPostingInput
								value={{
									jobPosting: formData.jobPosting,
									tone: formData.tone,
								}}
								onChange={handleJobPostingChange}
							/>

							<GenerateButton
								isLoading={isLoading}
								canGenerate={storageUtils.canGenerate()}
								onGenerate={generateContent}
							/>
						</form>
					</Card>
				</div>
			</div>
		</>
	)
}

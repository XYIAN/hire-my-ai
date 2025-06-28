'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SplitButton } from 'primereact/splitbutton'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { ResumeInput } from '@/components/resume-input'
import { JobPostingInput } from '@/components/job-posting-input'
import { UsageDisplay } from '@/components/usage-display'
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

	const handleJobPostingChange = useCallback((jobData: { jobPosting: string; tone: 'professional' | 'casual' | 'witty' }) => {
		setFormData(prev => ({
			...prev,
			jobPosting: jobData.jobPosting,
			tone: jobData.tone,
		}))
	}, [])

	const generateContent = async (type: GenerationType) => {
		setError('')

		if (!formData.resume.trim() || !formData.jobPosting.trim()) {
			setError('Please fill in both resume and job posting fields.')
			toastError('Please fill in both resume and job posting fields.')
			return
		}

		if (!storageUtils.canGenerate()) {
			setError('Daily limit reached. Please try again tomorrow!')
			toastError('You have reached your daily limit. Please try again tomorrow!')
			return
		}

		setIsLoading(true)

		try {
			const successUsage = storageUtils.incrementUsage()
			if (!successUsage) {
				setError('Daily limit reached. Please try again tomorrow!')
				toastError('You have reached your daily limit. Please try again tomorrow!')
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
				'outreach': 'Your outreach message has been crafted!',
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

	const splitButtonItems = [
		{
			label: 'Cover Letter',
			icon: 'pi pi-file',
			command: () => generateContent('cover-letter'),
		},
		{
			label: 'Email Response',
			icon: 'pi pi-envelope',
			command: () => generateContent('email-response'),
		},
		{
			label: 'Outreach',
			icon: 'pi pi-users',
			command: () => generateContent('outreach'),
		},
	]

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Generate Your Content
					</h1>
					<p className="text-gray-600">
						Paste your resume and the job posting to create tailored content.
					</p>
				</div>

				<UsageDisplay />

				<Card className="shadow-lg">
					<form onSubmit={(e) => e.preventDefault()} className="space-y-6">
						{error && (
							<Message
								severity="error"
								text={error}
								className="w-full"
							/>
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

						<div className="flex justify-end">
							<SplitButton
								label="Generate Cover Letter"
								icon="pi pi-magic"
								model={splitButtonItems}
								loading={isLoading}
								disabled={isLoading || !storageUtils.canGenerate()}
								onClick={() => generateContent('cover-letter')}
							/>
						</div>
					</form>
				</Card>
			</div>
		</div>
	)
} 
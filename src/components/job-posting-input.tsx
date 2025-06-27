'use client'

import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { JobPostingData } from '@/types'

interface JobPostingInputProps {
	value: JobPostingData
	onChange: (value: JobPostingData) => void
}

const toneOptions = [
	{ label: 'Professional', value: 'professional' },
	{ label: 'Casual', value: 'casual' },
	{ label: 'Witty', value: 'witty' },
]

export function JobPostingInput({ value, onChange }: JobPostingInputProps) {
	const handleJobPostingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange({
			...value,
			jobPosting: e.target.value,
		})
	}

	const handleToneChange = (tone: 'professional' | 'casual' | 'witty') => {
		onChange({
			...value,
			tone,
		})
	}

	return (
		<div className="w-full space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Job Posting
				</label>
				<InputTextarea
					value={value.jobPosting}
					onChange={handleJobPostingChange}
					placeholder="Paste the job posting here... Include the job description, requirements, and any specific details about the role."
					rows={6}
					className="w-full"
					autoResize
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Tone
				</label>
				<Dropdown
					value={value.tone}
					options={toneOptions}
					onChange={(e) => handleToneChange(e.value)}
					placeholder="Select tone"
					className="w-full"
				/>
				<p className="text-xs text-gray-500 mt-1">
					Choose the tone for your generated content
				</p>
			</div>
		</div>
	)
} 
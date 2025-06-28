'use client'

import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect, useState, useCallback } from 'react'
import { storageUtils } from '@/utils/storage'

interface ResumeInputProps {
	value: string
	onChange: (value: string) => void
}

export function ResumeInput({ value, onChange }: ResumeInputProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		// Load saved resume on component mount only once
		if (!isInitialized) {
			const savedResume = storageUtils.getResume()
			if (savedResume && savedResume !== value) {
				onChange(savedResume)
			}
			setIsInitialized(true)
			setIsLoading(false)
		}
	}, [isInitialized, onChange, value])

	const handleResumeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		onChange(newValue)
		storageUtils.saveResume(newValue)
	}, [onChange])

	if (isLoading) {
		return (
			<div className="w-full">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Resume
				</label>
				<div className="w-full h-32 bg-gray-100 animate-pulse rounded"></div>
			</div>
		)
	}

	return (
		<div className="w-full">
			<label className="block text-sm font-medium text-gray-700 mb-2">
				Resume
			</label>
			<InputTextarea
				value={value}
				onChange={handleResumeChange}
				placeholder="Paste your resume here... Include your experience, skills, education, and any relevant information that would help create a tailored cover letter."
				rows={8}
				className="w-full"
				autoResize
			/>
			<p className="text-xs text-gray-500 mt-1">
				Your resume is automatically saved and will be loaded next time you visit.
			</p>
		</div>
	)
} 
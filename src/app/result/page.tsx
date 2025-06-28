'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Message } from 'primereact/message'
import { useWizardToast } from '@/hooks/use-wizard-toast'

function ResultContent() {
	const router = useRouter()
	const { success, error: toastError } = useWizardToast()
	const searchParams = useSearchParams()
	const [content, setContent] = useState('')
	const [isExporting, setIsExporting] = useState(false)

	useEffect(() => {
		const contentParam = searchParams.get('content')
		if (contentParam) {
			setContent(decodeURIComponent(contentParam))
		} else {
			// Redirect to builder if no content
			router.push('/builder')
		}
	}, [searchParams, router])

	const handleExportPDF = async () => {
		if (typeof window === 'undefined') return

		setIsExporting(true)
		try {
			const html2pdf = (await import('html2pdf.js')).default
			
			const element = document.getElementById('cover-letter-content')
			if (element) {
				const opt = {
					margin: 1,
					filename: 'cover-letter.pdf',
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2 },
					jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
				}
				
				await html2pdf().set(opt).from(element).save()
				success('Your magical PDF is ready for download!')
			}
		} catch (error) {
			toastError('The wizard failed to conjure your PDF!')
			console.error('Export error:', error)
		} finally {
			setIsExporting(false)
		}
	}

	const handleStartOver = () => {
		router.push('/builder')
	}

	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(content)
			success('Copied to your spellbook (clipboard)!')
		} catch (error) {
			toastError('The wizard could not copy your text!')
			console.error('Copy error:', error)
		}
	}

	if (!content) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold  mb-2">
						Your Generated Cover Letter
					</h1>
					<p className="">
						Review your AI-generated cover letter below.
					</p>
				</div>

				<div className="mb-6 flex flex-wrap gap-3">
					<Button
						label="Export as PDF"
						icon="pi pi-download"
						loading={isExporting}
						onClick={handleExportPDF}
					/>
					<Button
						label="Copy to Clipboard"
						icon="pi pi-copy"
						onClick={handleCopyToClipboard}
					/>
					<Button
						label="Start Over"
						icon="pi pi-refresh"
						onClick={handleStartOver}
						severity="secondary"
					/>
				</div>

				<Card className="shadow-lg">
					<div
						id="cover-letter-content"
						className="prose prose-lg max-w-none"
						
					>
						<div
							dangerouslySetInnerHTML={{
								__html: content.replace(/\n/g, '<br />'),
							}}
						/>
					</div>
				</Card>

				<div className="mt-6">
					<Message
						severity="info"
						text="You can edit this content before using it. Remember to personalize it further if needed."
						className="w-full"
					/>
				</div>
			</div>
		</div>
	)
}

export default function ResultPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="">Loading...</p>
				</div>
			</div>
		}>
			<ResultContent />
		</Suspense>
	)
} 
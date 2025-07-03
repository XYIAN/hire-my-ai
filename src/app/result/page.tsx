'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWizardToast } from '@/hooks/use-wizard-toast'
import { PageHeader } from '@/components/result/page-header'
import { ActionButtons } from '@/components/result/action-buttons'
import { ContentDisplay } from '@/components/result/content-display'
import { InfoMessage } from '@/components/result/info-message'
import { LoadingState } from '@/components/result/loading-state'

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
					jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
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
		return <LoadingState />
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				<PageHeader
					title="Your Generated Cover Letter"
					description="Review your AI-generated cover letter below."
				/>

				<ActionButtons
					isExporting={isExporting}
					onExportPDF={handleExportPDF}
					onCopyToClipboard={handleCopyToClipboard}
					onStartOver={handleStartOver}
				/>

				<ContentDisplay content={content} />

				<InfoMessage text="You can edit this content before using it. Remember to personalize it further if needed." />
			</div>
		</div>
	)
}

export default function ResultPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<ResultContent />
		</Suspense>
	)
}

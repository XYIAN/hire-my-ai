'use client'

import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'

export function HeroSection() {
	const router = useRouter()

	const handleGetStarted = () => {
		router.push('/builder')
	}

	return (
		<section className="min-h-screen flex items-center justify-center  text-white">
			<div className="container mx-auto px-4 text-center">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
						HireMyAI
					</h1>
					<p className="text-xl md:text-2xl mb-8 leading-relaxed">
						Generate tailored cover letters, recruiter responses, and follow-up messages 
						powered by AI. Stand out from the crowd with personalized content that matches 
						your resume and the job requirements.
					</p>
					<div className="space-y-4">
						<Button
							label="Get Started"
							icon="pi pi-rocket"
							size="large"
							className="p-button-lg"
							onClick={handleGetStarted}
						/>
						<p className="text-sm opacity-80">
							Free • 10 generations per day • No registration required
						</p>
					</div>
				</div>
			</div>
		</section>
	)
} 
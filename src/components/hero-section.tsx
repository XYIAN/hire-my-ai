'use client'

import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'

export function HeroSection() {
	const router = useRouter()

	const handleGetStarted = () => {
		router.push('/builder')
	}

	return (
		<div className="min-h-screen flex flex-col">
			<section className="flex-1 flex items-center justify-center text-white">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
							HireMyAI
						</h1>
						<p className="text-xl md:text-2xl mb-8 leading-relaxed">
							Generate tailored cover letters, recruiter responses, and
							follow-up messages powered by AI. Stand out from the crowd with
							personalized content that matches your resume and the job
							requirements.
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

			{/* GitHub Profile Link Section */}
			<footer className="py-8 text-center">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center space-y-3">
						<div className="flex items-center space-x-2 text-white opacity-80">
							<i className="pi pi-github text-xl"></i>
							<span className="text-lg">Follow me on GitHub</span>
						</div>
						<a
							href="https://github.com/your-username"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 text-white hover:text-amber-300"
						>
							<i className="pi pi-external-link"></i>
							<span>View Profile</span>
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}

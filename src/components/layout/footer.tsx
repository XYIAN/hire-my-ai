export function Footer() {
	return (
		<footer className="py-8 text-center">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center space-y-3">
					<div className="flex items-center space-x-2 text-white opacity-80">
						<i className="pi pi-github text-xl"></i>
						<span className="text-lg">Follow me on GitHub</span>
					</div>
					<a
						href="https://github.com/xyian"
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
	)
}

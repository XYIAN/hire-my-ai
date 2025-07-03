import { Footer } from './footer'

interface AppLayoutProps {
	children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	)
}

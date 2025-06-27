'use client'

import { PrimeReactProvider } from 'primereact/api'

export function PrimeReactAppProvider({ children }: { children: React.ReactNode }) {
	return (
		<PrimeReactProvider>
			{children}
		</PrimeReactProvider>
	)
} 
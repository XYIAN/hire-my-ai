import { ProgressSpinner } from 'primereact/progressspinner'

interface LoadingOverlayProps {
	isLoading: boolean
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
	if (!isLoading) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
				<ProgressSpinner style={{ width: '50px', height: '50px' }} />
				<div className="text-center">
					<h3 className="text-lg font-semibold mb-2">
						🧙‍♂️ The Wizard is Working...
					</h3>
					<p className="text-sm">Crafting your magical content...</p>
				</div>
			</div>
		</div>
	)
}

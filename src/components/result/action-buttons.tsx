import { Button } from 'primereact/button'

interface ActionButtonsProps {
	isExporting: boolean
	onExportPDF: () => void
	onCopyToClipboard: () => void
	onStartOver: () => void
}

export function ActionButtons({
	isExporting,
	onExportPDF,
	onCopyToClipboard,
	onStartOver,
}: ActionButtonsProps) {
	return (
		<div className="mb-6 flex flex-wrap gap-3">
			<Button
				label="Export as PDF"
				icon="pi pi-download"
				loading={isExporting}
				onClick={onExportPDF}
			/>
			<Button
				label="Copy to Clipboard"
				icon="pi pi-copy"
				onClick={onCopyToClipboard}
			/>
			<Button
				label="Start Over"
				icon="pi pi-refresh"
				onClick={onStartOver}
				severity="secondary"
			/>
		</div>
	)
}

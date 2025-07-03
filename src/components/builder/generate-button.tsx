import { SplitButton } from 'primereact/splitbutton'
import { GenerationType } from '@/types'

interface GenerateButtonProps {
	isLoading: boolean
	canGenerate: boolean
	onGenerate: (type: GenerationType) => void
}

export function GenerateButton({
	isLoading,
	canGenerate,
	onGenerate,
}: GenerateButtonProps) {
	const splitButtonItems = [
		{
			label: 'Cover Letter',
			icon: 'pi pi-file',
			command: () => onGenerate('cover-letter'),
		},
		{
			label: 'Email Response',
			icon: 'pi pi-envelope',
			command: () => onGenerate('email-response'),
		},
		{
			label: 'Outreach',
			icon: 'pi pi-users',
			command: () => onGenerate('outreach'),
		},
	]

	return (
		<div className="flex justify-end">
			<SplitButton
				label="Generate Cover Letter"
				icon="pi pi-magic"
				model={splitButtonItems}
				loading={isLoading}
				disabled={isLoading || !canGenerate}
				onClick={() => onGenerate('cover-letter')}
			/>
		</div>
	)
}

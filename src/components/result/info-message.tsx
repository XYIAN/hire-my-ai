import { Message } from 'primereact/message'

interface InfoMessageProps {
	text: string
}

export function InfoMessage({ text }: InfoMessageProps) {
	return (
		<div className="mt-6">
			<Message severity="info" text={text} className="w-full" />
		</div>
	)
}

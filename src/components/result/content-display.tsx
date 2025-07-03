import { Card } from 'primereact/card'

interface ContentDisplayProps {
	content: string
}

export function ContentDisplay({ content }: ContentDisplayProps) {
	return (
		<Card className="shadow-lg">
			<div id="cover-letter-content" className="prose prose-lg max-w-none">
				<div
					dangerouslySetInnerHTML={{
						__html: content.replace(/\n/g, '<br />'),
					}}
				/>
			</div>
		</Card>
	)
}

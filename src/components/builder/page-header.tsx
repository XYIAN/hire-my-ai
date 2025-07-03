interface BuilderPageHeaderProps {
	title: string
	description: string
}

export function BuilderPageHeader({
	title,
	description,
}: BuilderPageHeaderProps) {
	return (
		<div className="mb-8">
			<h1 className="text-3xl font-bold mb-2">{title}</h1>
			<p>{description}</p>
		</div>
	)
}

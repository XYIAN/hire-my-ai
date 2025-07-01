import OpenAI from 'openai'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

function getSystemPrompt(type, tone) {
	const basePrompt = `You are an expert career coach and communication specialist. Your task is to generate tailored content based on the provided resume and job posting.

Guidelines:
- Analyze the job requirements and match them with the candidate's experience
- Use the specified tone: ${tone}
- Keep the response professional yet engaging
- Highlight relevant skills and experiences
- Make it specific to the job posting
- Keep it concise but comprehensive (300-500 words)

Format the response as a well-structured document with proper paragraphs and professional formatting.`

	switch (type) {
		case 'cover-letter':
			return `${basePrompt}

Specific Instructions for Cover Letter:
- Format as a traditional cover letter with proper salutation and closing
- Address the hiring manager or "Dear Hiring Manager"
- Include specific examples from the resume that match job requirements
- End with a call to action requesting an interview
- Keep it to 3-4 paragraphs maximum`

		case 'email-response':
			return `${basePrompt}

Specific Instructions for Email Response:
- Format as a professional email response
- Use a clear subject line format: "Re: [Original Subject]"
- Keep the tone conversational but professional
- Address specific points from the original email
- Include relevant experience that addresses their needs
- End with a clear next step or call to action`

		case 'outreach':
			return `${basePrompt}

Specific Instructions for Outreach Email:
- Format as a cold outreach email to introduce yourself
- Use a compelling subject line that shows value
- Start with a brief introduction and your background
- Explain why you're reaching out to this specific company
- Highlight how your skills could benefit them
- Include a specific ask (informational interview, coffee chat, etc.)
- Keep it warm, professional, and not overly salesy
- End with a clear, low-pressure call to action`

		default:
			return basePrompt
	}
}

export async function handler(event) {
	// Enable CORS
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
	}

	// Handle preflight requests
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers,
			body: '',
		}
	}

	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers,
			body: JSON.stringify({ error: 'Method not allowed' }),
		}
	}

	try {
		const body = JSON.parse(event.body)
		const { resume, jobPosting, tone, type } = body

		if (!resume || !jobPosting) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ error: 'Resume and job posting are required' }),
			}
		}

		const systemPrompt = getSystemPrompt(type, tone)

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{
					role: 'user',
					content: `Resume:\n${resume}\n\nJob Posting:\n${jobPosting}\n\nPlease generate a ${tone} ${type.replace(
						'-',
						' '
					)}.`,
				},
			],
			max_tokens: 800,
			temperature: 0.7,
		})

		const content =
			completion.choices[0]?.message?.content || 'No response generated'
		const usage = completion.usage

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				content,
				usage,
			}),
		}
	} catch (error) {
		console.error('Generation error:', error)
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: 'Failed to generate content' }),
		}
	}
}

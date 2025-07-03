import { OpenAI } from 'openai'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export const handler = async event => {
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
		const { resume, jobPosting, tone, type } = JSON.parse(event.body)

		if (!resume || !jobPosting) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({ error: 'Resume and job posting are required' }),
			}
		}

		const prompts = {
			'cover-letter': `Write a professional ${tone} cover letter based on the following resume and job posting. Make it compelling and tailored to the specific role. Focus on relevant experience and skills that match the job requirements.

Resume:
${resume}

Job Posting:
${jobPosting}

Cover Letter:`,
			'email-response': `Write a professional ${tone} email response to a recruiter based on the following resume and job posting. Make it concise, engaging, and show enthusiasm for the opportunity.

Resume:
${resume}

Job Posting:
${jobPosting}

Email Response:`,
			outreach: `Write a professional ${tone} outreach message to connect with someone at the company based on the following resume and job posting. Make it genuine, specific, and show how you can add value.

Resume:
${resume}

Job Posting:
${jobPosting}

Outreach Message:`,
		}

		const prompt = prompts[type] || prompts['cover-letter']

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are a professional career coach and resume writer. Create compelling, personalized content that helps job seekers stand out.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			max_tokens: 1000,
			temperature: 0.7,
		})

		const content =
			completion.choices[0]?.message?.content || 'No content generated'

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({ content }),
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

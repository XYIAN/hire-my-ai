import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GenerationRequest } from '@/types'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
	try {
		const body: GenerationRequest = await request.json()
		const { resume, jobPosting, tone } = body

		if (!resume || !jobPosting) {
			return NextResponse.json(
				{ error: 'Resume and job posting are required' },
				{ status: 400 }
			)
		}

		const systemPrompt = `You are an expert career coach and resume writer. Your task is to generate a tailored cover letter or response based on the provided resume and job posting.

Guidelines:
- Analyze the job requirements and match them with the candidate's experience
- Use the specified tone: ${tone}
- Keep the response professional yet engaging
- Highlight relevant skills and experiences
- Make it specific to the job posting
- Keep it concise but comprehensive (300-500 words)

Format the response as a well-structured cover letter with proper paragraphs and professional formatting.`

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{
					role: 'user',
					content: `Resume:\n${resume}\n\nJob Posting:\n${jobPosting}\n\nPlease generate a ${tone} cover letter.`,
				},
			],
			max_tokens: 800,
			temperature: 0.7,
		})

		const content = completion.choices[0]?.message?.content || 'No response generated'
		const usage = completion.usage

		return NextResponse.json({
			content,
			usage,
		})
	} catch (error) {
		console.error('Generation error:', error)
		return NextResponse.json(
			{ error: 'Failed to generate content' },
			{ status: 500 }
		)
	}
} 
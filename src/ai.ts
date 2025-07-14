import {GoogleGenerativeAI, GenerateContentResult} from '@google/generative-ai'
import type {Message} from './parse'
import 'dotenv/config'

const AI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
	.getGenerativeModel({model: 'gemini-2.0-flash-exp'})

const CONFIG = {
	temperature: 0.7,
	topK: 40,
	topP: 0.95,
	maxOutputTokens: 8192,
}

type ConversationProps = {userMessage: string, history: Message[]}

export async function fetchAIResponse(props: ConversationProps) {
	if (!props.userMessage) {
		return history
	}

	const chatSession = AI.startChat({
		generationConfig: CONFIG,
		history: props.history.map(({role, content}) => ({role, parts: [{text: content}]}))
	})

	const response = await chatSession.sendMessage(props.userMessage)

	return buildConversation(props, response)
}

function buildConversation(props: ConversationProps, ai: GenerateContentResult) {
	
	const userMessage: Message = {
		role: 'user',
		content: props.userMessage,
	}

	const aiResponse: Message = {
		role: 'model',
		content: ai.response.text()
	}
	
	return [...props.history, userMessage, aiResponse]
}

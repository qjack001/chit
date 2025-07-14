
export type Message = {role: 'user' | 'model', content: string}

export async function parseForm(data: Promise<FormData>) {
	
	const formData = await data
	const userMessageData = formData?.get('message')
	const messageHistoryData = formData?.get('history')

	return {
		userMessage: userMessageData?.toString() || '',
		history: JSON.parse(messageHistoryData?.toString() || '[]') as Message[]
	}
}

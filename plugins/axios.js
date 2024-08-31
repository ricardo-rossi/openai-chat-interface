import axios from 'axios'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const apiClient = axios.create({
        baseURL: 'https://api.openai.com/v1',
        headers: {
            Authorization: `Bearer ${config.public.openaiApiKey}`,
            'Content-Type': 'application/json',
        },
    })

    return {
        provide: {
            apiClient,
        },
    }
})
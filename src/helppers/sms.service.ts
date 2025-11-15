import { env } from '@/lib/env'
import axios from 'axios'

export const smsService = async (
  to: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await axios.post(
      'https://api.ola.pavulla.com/v1/messages',
      {
        sender: '',
        recipient: to,
        content: message,
        provider_id: env.SMS_PROVIDER_ID,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${env.RESEND_API_KEY}`,
        },
      }
    )
    return { success: true }
  } catch (error: any) {
    console.log('error', error)
    return { success: false, error: error?.response?.data.message }
  }
}

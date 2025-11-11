import { logger } from '@/utils/logger'
import type { ISendAlertBody, SendAlertRequest } from './alerts.schema'
import { GroupRepository } from '../community/community.repository'
import { smsService } from '@/helppers/sms.service'
import { AlertResult } from '@/@types/alerts'

export class AlertsService {
  constructor(private readonly groupRepository: GroupRepository) {}
  async sendAlert(
    userId: string,
    username: string,
    request: ISendAlertBody
  ): Promise<{
    success: boolean
    failed?: any
    error?: string
  }> {
    try {
      const userContacts =
        await this.groupRepository.findContactsByUserId(userId)

      const validContactsMap = new Map(
        userContacts.map((contact) => [contact.id, contact])
      )
      const sendSmsInfo = []

      const invalidContactIds: string[] = []
      const validContacts: Array<{
        id: string
        name: string
        phone: string
        groupId: string
        groupName: string
      }> = []

      request.contactIds.forEach((contactId) => {
        const contact = validContactsMap.get(contactId)
        if (!contact) {
          invalidContactIds.push(contactId)
        } else {
          validContacts.push(contact)
        }
      })

      if (validContacts.length === 0) {
        return {
          success: false,
          error: 'Nenhum contacto válido para enviar alerta',
        }
      }

      for (const contact of validContacts) {
        const sendSms = await smsService(
          contact.phone,
          `${contact.name}, estou em perigo. Preciso da sua ajuda urgente! 
— ${username}`
        )

        if (!sendSms.success) {
          sendSmsInfo.push({ ...contact, status: ' failed' })
        }
      }

      console.log(sendSmsInfo)

      if (sendSmsInfo.length === request.contactIds.length) {
        return {
          success: false,
        }
      }
      return {
        success: true,
        failed: sendSmsInfo.length >= 1 ? sendSmsInfo : 0,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error sending alert', { error: errorMessage })
      return {
        success: false,
        error: errorMessage || 'Erro ao enviar alerta',
      }
    }
  }
}

export const alertsService = new AlertsService(new GroupRepository())

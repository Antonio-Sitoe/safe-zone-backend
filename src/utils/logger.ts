import { env } from '../lib/env'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

class Logger {
  private logLevel: LogLevel

  constructor() {
    this.logLevel = (env.LOG_LEVEL as LogLevel) || LogLevel.INFO
    this.logLevel = (env.LOG_LEVEL as LogLevel) || LogLevel.INFO
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
    ]
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex <= currentLevelIndex
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const levelUpper = level.toUpperCase().padEnd(5)

    let formattedMessage = `[${timestamp}] ${levelUpper} ${message}`

    if (meta) {
      formattedMessage += ` ${JSON.stringify(meta)}`
    }

    return formattedMessage
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    if (!this.shouldLog(level)) return

    const formattedMessage = this.formatMessage(level, message, meta)

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage)
        break
      case LogLevel.WARN:
        console.warn(formattedMessage)
        break
      case LogLevel.INFO:
        console.info(formattedMessage)
        break
      case LogLevel.DEBUG:
        console.debug(formattedMessage)
        break
    }
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta)
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta)
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta)
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta)
  }

  request(
    method: string,
    url: string,
    statusCode: number,
    duration: number
  ): void {
    this.info(`HTTP ${method} ${url} ${statusCode} - ${duration}ms`)
  }

  auth(action: string, userId?: string): void {
    this.info(`Auth: ${action}`, { userId })
  }

  database(operation: string, table: string, duration?: number): void {
    this.debug(`DB: ${operation} on ${table}`, { duration })
  }

  security(event: string, details?: any): void {
    this.warn(`Security: ${event}`, details)
  }
}

export const logger = new Logger()

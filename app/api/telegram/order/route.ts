import { NextResponse } from 'next/server'

type TelegramOrderPayload = {
  orderId?: number
  customer: {
    firstName: string
    lastName: string
    messengerId?: string
    phone?: string
    address?: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  totalItems: number
  totalPrice: number
}

const escapeMarkdownV2 = (value: string) =>
  value.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')

const formatNumber = (value: number) =>
  value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })

const buildMessage = (payload: TelegramOrderPayload) => {
  const fullName = `${payload.customer.firstName} ${payload.customer.lastName}`.trim()
  const lines = [
    '*Новый заказ*',
    payload.orderId ? `*ID:* \`${payload.orderId}\`` : '',
    '',
    `*Клиент:* ${escapeMarkdownV2(fullName)}`,
    payload.customer.phone
      ? `*Телефон:* \`${escapeMarkdownV2(payload.customer.phone)}\``
      : '',
    payload.customer.messengerId
      ? `*ID в мессенджере:* \`${escapeMarkdownV2(payload.customer.messengerId)}\``
      : '',
    payload.customer.address
      ? `*Адрес:* ${escapeMarkdownV2(payload.customer.address)}`
      : '',
    '',
    '*Состав заказа:*',
    ...payload.items.map((item) => {
      const lineTotal = item.price * item.quantity
      return `\\- ${escapeMarkdownV2(item.name)} × ${item.quantity} — ${escapeMarkdownV2(
        formatNumber(lineTotal)
      )} ₽`
    }),
    '',
    `*Итого:* ${escapeMarkdownV2(formatNumber(payload.totalPrice))} ₽`,
    `*Товаров:* ${payload.totalItems}`,
  ]

  return lines.filter(Boolean).join('\n')
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ORDERS_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json(
      { message: 'Telegram credentials are not configured' },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => null)) as
    | TelegramOrderPayload
    | null

  if (!body?.customer || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { message: 'Invalid payload' },
      { status: 400 }
    )
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(body),
        parse_mode: 'MarkdownV2',
      }),
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json(data ?? { message: 'Telegram error' }, {
      status: response.status,
    })
  }

  return NextResponse.json({ status: 'ok' })
}

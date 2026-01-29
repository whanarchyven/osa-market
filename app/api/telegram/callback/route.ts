import { NextResponse } from 'next/server'

type CallbackPayload = {
  name: string
  phone: string
  comment: string
}

const escapeMarkdownV2 = (value: string) =>
  value.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')

const buildMessage = (payload: CallbackPayload) => {
  const lines = [
    '*Запрос на звонок*',
    '',
    `*Имя:* ${escapeMarkdownV2(payload.name)}`,
    `*Телефон:* \`${escapeMarkdownV2(payload.phone)}\``,
    '',
    '*Комментарий:*',
    escapeMarkdownV2(payload.comment),
  ]

  return lines.filter(Boolean).join('\n')
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CALLBACKS_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json(
      { message: 'Telegram credentials are not configured' },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => null)) as CallbackPayload | null

  if (!body?.name || !body?.phone || !body?.comment) {
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

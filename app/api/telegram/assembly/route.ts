import { NextResponse } from 'next/server'

type AssemblyPayload = {
  name: string
  phone: string
  email?: string
  comment?: string
}

const escapeMarkdownV2 = (value: string) =>
  value.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')

const buildMessage = (payload: AssemblyPayload) => {
  const lines = [
    '*Заявка: сборка ПК*',
    '',
    `*Имя:* ${escapeMarkdownV2(payload.name)}`,
    `*Телефон:* \`${escapeMarkdownV2(payload.phone)}\``,
    payload.email ? `*Email:* \`${escapeMarkdownV2(payload.email)}\`` : '',
    payload.comment
      ? '*Комментарий:*\n' + escapeMarkdownV2(payload.comment)
      : '',
  ]

  return lines.filter(Boolean).join('\n')
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ASSEMBLY_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json(
      {
        message:
          'Telegram credentials are not configured (TELEGRAM_BOT_TOKEN или TELEGRAM_ASSEMBLY_CHAT_ID)',
      },
      { status: 500 }
    )
  }

  const rawBody = (await request.json().catch(() => null)) as AssemblyPayload | null
  const body = rawBody
    ? {
        name: rawBody.name?.trim(),
        phone: rawBody.phone?.trim(),
        email: rawBody.email?.trim(),
        comment: rawBody.comment?.trim(),
      }
    : null

  if (!body?.name || !body?.phone) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

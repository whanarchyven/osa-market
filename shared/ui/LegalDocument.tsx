type LegalDocumentProps = {
  title: string
  subtitle?: string
  content: string
}

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'page'; text: string }

const isPageMarker = (line: string) => /^-- \d+ of \d+ --$/.test(line)
const isSectionTitle = (line: string) => /^\d+\.\s/.test(line)
const isSubsectionTitle = (line: string) => /^\d+\.\d+\.\s/.test(line)
const isBullet = (line: string) => /^[•]\s?/.test(line)

const normalizeBullet = (line: string) => line.replace(/^[•]\s?/, '').trim()

const parseLegalContent = (content: string): Block[] => {
  const lines = content.split('\n').map((line) => line.trim())
  const blocks: Block[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (!line) {
      i += 1
      continue
    }

    if (isPageMarker(line)) {
      blocks.push({ type: 'page', text: line })
      i += 1
      continue
    }

    if (isSubsectionTitle(line)) {
      const parts = [line]
      while (
        i + 1 < lines.length &&
        lines[i + 1] &&
        !isPageMarker(lines[i + 1]) &&
        !isSectionTitle(lines[i + 1]) &&
        !isSubsectionTitle(lines[i + 1]) &&
        !isBullet(lines[i + 1])
      ) {
        const next = lines[i + 1]
        const looksLikeWrappedHeading =
          parts.join(' ').length < 90 &&
          !/[.!?]$/.test(parts[parts.length - 1]) &&
          next === next.toLowerCase()

        if (!looksLikeWrappedHeading) break
        parts.push(next)
        i += 1
      }

      blocks.push({ type: 'h3', text: parts.join(' ') })
      i += 1
      continue
    }

    if (isSectionTitle(line)) {
      const parts = [line]
      while (
        i + 1 < lines.length &&
        lines[i + 1] &&
        !isPageMarker(lines[i + 1]) &&
        !isSectionTitle(lines[i + 1]) &&
        !isSubsectionTitle(lines[i + 1]) &&
        !isBullet(lines[i + 1])
      ) {
        const next = lines[i + 1]
        const looksLikeWrappedHeading =
          parts.join(' ').length < 80 &&
          !/[.!?]$/.test(parts[parts.length - 1]) &&
          next === next.toLowerCase()

        if (!looksLikeWrappedHeading) break
        parts.push(next)
        i += 1
      }

      blocks.push({ type: 'h2', text: parts.join(' ') })
      i += 1
      continue
    }

    if (isBullet(line)) {
      const items: string[] = []

      while (i < lines.length && isBullet(lines[i])) {
        const itemParts = [normalizeBullet(lines[i])]
        while (
          i + 1 < lines.length &&
          lines[i + 1] &&
          !isPageMarker(lines[i + 1]) &&
          !isSectionTitle(lines[i + 1]) &&
          !isSubsectionTitle(lines[i + 1]) &&
          !isBullet(lines[i + 1])
        ) {
          itemParts.push(lines[i + 1])
          i += 1
        }
        items.push(itemParts.join(' '))
        i += 1
      }

      blocks.push({ type: 'ul', items })
      continue
    }

    const paragraphParts = [line]
    while (
      i + 1 < lines.length &&
      lines[i + 1] &&
      !isPageMarker(lines[i + 1]) &&
      !isSectionTitle(lines[i + 1]) &&
      !isSubsectionTitle(lines[i + 1]) &&
      !isBullet(lines[i + 1])
    ) {
      paragraphParts.push(lines[i + 1])
      i += 1
    }

    blocks.push({ type: 'p', text: paragraphParts.join(' ') })
    i += 1
  }

  return blocks
}

export function LegalDocument({ title, subtitle, content }: LegalDocumentProps) {
  const blocks = parseLegalContent(content)

  return (
    <main className="min-h-screen bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card/60 p-6 md:p-10">
          <div className="border-b border-border/60 pb-6">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="mt-8 space-y-5">
            {blocks.map((block, index) => {
              if (block.type === 'page') {
                return (
                  <div
                    key={`${block.text}-${index}`}
                    className="flex items-center gap-4 py-2"
                  >
                    <div className="h-px flex-1 bg-border/60" />
                    <span className="text-xs text-muted-foreground">
                      {block.text}
                    </span>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>
                )
              }

              if (block.type === 'h2') {
                return (
                  <h2
                    key={`${block.text}-${index}`}
                    className="pt-4 text-xl font-semibold text-foreground md:text-2xl"
                  >
                    {block.text}
                  </h2>
                )
              }

              if (block.type === 'h3') {
                return (
                  <h3
                    key={`${block.text}-${index}`}
                    className="text-base font-semibold text-foreground md:text-lg"
                  >
                    {block.text}
                  </h3>
                )
              }

              if (block.type === 'ul') {
                return (
                  <ul
                    key={`ul-${index}`}
                    className="space-y-2 pl-5 text-sm leading-7 text-muted-foreground md:text-base"
                  >
                    {block.items.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              }

              return (
                <p
                  key={`${block.text}-${index}`}
                  className="text-sm leading-7 text-muted-foreground md:text-base"
                >
                  {block.text}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

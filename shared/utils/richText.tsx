import React from 'react'
import { cn } from '@/lib/utils'

export function parseRichText(html: string): React.ReactNode {
  if (!html) return null

  // Replace <br /> tags with line breaks
  const parts = html.split(/(<br\s*\/?>\n?)/gi)

  return parts.map((part, index) => {
    // Skip br tags, they're handled by the split
    if (/<br\s*\/?>/i.test(part)) {
      return <br key={`br-${index}`} />
    }

    // Parse remaining HTML for <strong> tags
    const strongParts = part.split(/(<strong>.*?<\/strong>)/i)

    return (
      <React.Fragment key={`part-${index}`}>
        {strongParts.map((subpart, subindex) => {
          if (/<strong>/i.test(subpart)) {
            const text = subpart.replace(/<\/?strong>/gi, '')
            return (
              <strong key={`strong-${index}-${subindex}`} className="font-bold text-primary">
                {text}
              </strong>
            )
          }
          // Remove <p> and </p> tags
          return subpart.replace(/<\/?p>/gi, '')
        })}
      </React.Fragment>
    )
  })
}

export function parseRichTextBlock(
  html: string,
  className?: string
): React.ReactNode {
  if (!html) return null

  return (
    <div
      className={cn(
        '[&_strong]:font-bold [&_strong]:text-primary [&_p]:mb-4 [&_h1]:mb-4 [&_h2]:mb-4 [&_h3]:mb-3',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

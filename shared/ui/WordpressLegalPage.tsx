import { parseRichTextBlock } from '@/shared/utils/richText'

type WordpressLegalPageProps = {
  html: string
}

export function WordpressLegalPage({ html }: WordpressLegalPageProps) {
  return (
    <main className="min-h-screen bg-background py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card/60 p-6 md:p-10">
          {parseRichTextBlock(
            html,
            'max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground md:[&_h1]:text-4xl [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground md:[&_h2]:text-2xl [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground md:[&_h3]:text-lg [&_p]:text-sm [&_p]:leading-7 [&_p]:text-muted-foreground md:[&_p]:text-base [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-7 [&_ul]:text-muted-foreground md:[&_ul]:text-base [&_li]:list-disc'
          )}
        </div>
      </div>
    </main>
  )
}

export type BackendMedia =
  | string
  | {
      url?: string | null
      src?: string | null
      alt?: string | null
      title?: string | null
    }
  | null
  | undefined

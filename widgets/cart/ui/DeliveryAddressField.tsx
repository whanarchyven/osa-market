'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Select, { components, type InputProps, type SingleValue } from 'react-select'
import { cn } from '@/lib/utils'

type DeliveryAddressFieldProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
}

type DadataSuggestion = {
  value?: string
}

type DadataResponse = {
  suggestions?: DadataSuggestion[]
}

type AddressOption = {
  value: string
  label: string
}

const VisibleInput = (props: InputProps<AddressOption, false>) => (
  <components.Input {...props} isHidden={false} />
)

export function DeliveryAddressField({
  value,
  onChange,
  onBlur,
  error,
}: DeliveryAddressFieldProps) {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const lastExecutedRef = useRef(0)
  const pendingTimeoutRef = useRef<number | null>(null)
  const latestQueryRef = useRef(value)
  const abortControllerRef = useRef<AbortController | null>(null)

  const options = useMemo<AddressOption[]>(
    () => suggestions.map((item) => ({ value: item, label: item })),
    [suggestions]
  )
  const selectedOption: AddressOption | null = value ? { value, label: value } : null

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    latestQueryRef.current = inputValue
    const query = inputValue.trim()
    if (query.length < 3) {
      setSuggestions([])
      if (pendingTimeoutRef.current) {
        window.clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
      abortControllerRef.current?.abort()
      return
    }

    const execute = async () => {
      const nextQuery = latestQueryRef.current.trim()
      if (nextQuery.length < 3) {
        setSuggestions([])
        return
      }

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      try {
        const response = await fetch('/api/dadata/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query: nextQuery }),
          signal: controller.signal,
        })

        if (!response.ok) {
          setSuggestions([])
          return
        }

        const data = (await response.json()) as DadataResponse
        const nextSuggestions =
          data?.suggestions
            ?.map((item) => item.value)
            .filter((item): item is string => Boolean(item)) ?? []

        setSuggestions(nextSuggestions)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setSuggestions([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    const now = Date.now()
    const elapsed = now - lastExecutedRef.current
    if (elapsed >= 1000) {
      lastExecutedRef.current = now
      execute()
      return
    }

    if (pendingTimeoutRef.current) {
      window.clearTimeout(pendingTimeoutRef.current)
    }

    pendingTimeoutRef.current = window.setTimeout(() => {
      lastExecutedRef.current = Date.now()
      execute()
    }, 1000 - elapsed)

    return () => {
      if (pendingTimeoutRef.current) {
        window.clearTimeout(pendingTimeoutRef.current)
      }
    }
  }, [inputValue])

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) {
        window.clearTimeout(pendingTimeoutRef.current)
      }
      abortControllerRef.current?.abort()
    }
  }, [])

  return (
    <div className="space-y-2 flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground" htmlFor={inputId}>
        Адрес доставки
      </label>
      <Select<AddressOption, false>
        inputId={inputId}
        unstyled
        components={{ Input: VisibleInput }}
        options={options}
        value={selectedOption}
        inputValue={inputValue}
        onInputChange={(nextValue, actionMeta) => {
          if (actionMeta.action === 'input-change') {
            setInputValue(nextValue)
            onChange(nextValue)
          }
        }}
        onChange={(option: SingleValue<AddressOption>) => {
          const nextValue = option?.value ?? ''
          setInputValue(nextValue)
          onChange(nextValue)
        }}
        onBlur={onBlur}
        placeholder="Начните вводить адрес"
        isClearable
        isLoading={isLoading}
        filterOption={() => true}
        controlShouldRenderValue={false}
        aria-invalid={Boolean(error)}
        aria-errormessage={error ? errorId : undefined}
        styles={{
          input: (base) => ({
            ...base,
            color: 'hsl(var(--foreground))',
            opacity: 1,
          }),
          singleValue: (base) => ({
            ...base,
            color: 'hsl(var(--foreground))',
          }),
          placeholder: (base) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
          }),
        }}
        classNames={{
          control: (state) =>
            cn(
              'min-h-11 rounded-lg border bg-input px-1 text-sm text-foreground shadow-none',
              state.isFocused &&
                'ring-2 ring-ring ring-offset-2 ring-offset-background',
              error && 'border-destructive ring-destructive',
              !error && 'border-border'
            ),
          valueContainer: () => 'px-2 py-0',
          input: () => 'text-sm text-foreground',
          placeholder: () => 'text-sm text-muted-foreground',
          singleValue: () => 'text-sm text-foreground',
          menu: () =>
            'mt-2 rounded-lg border border-border bg-card text-sm text-foreground shadow-lg',
          option: (state) =>
            cn(
              'px-3 py-2 cursor-pointer',
              state.isFocused && 'bg-secondary text-foreground',
              state.isSelected && 'bg-secondary text-foreground'
            ),
          indicatorsContainer: () => 'gap-1 pr-2 text-muted-foreground',
          clearIndicator: () =>
            'text-muted-foreground hover:text-foreground transition-colors',
          dropdownIndicator: () =>
            'text-muted-foreground hover:text-foreground transition-colors',
          indicatorSeparator: () => 'hidden',
          menuList: () => 'py-1',
        }}
        noOptionsMessage={() =>
          value.trim().length < 3
            ? 'Введите минимум 3 символа'
            : 'Ничего не найдено'
        }
      />
      {isLoading && (
        <div className="text-xs text-muted-foreground">Ищем подсказки…</div>
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

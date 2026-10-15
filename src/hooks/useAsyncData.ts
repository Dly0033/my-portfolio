import { useEffect, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: null, error: null })

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null, error: null })

    fetcher()
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null })
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            status: 'error',
            data: null,
            error: err instanceof Error ? err : new Error(String(err)),
          })
        }
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

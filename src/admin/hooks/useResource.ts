import { useCallback, useEffect, useState } from 'react'

export type ResourceState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

/** 与 useAsyncData 类似，但额外提供 reload 以支持增删改后刷新。 */
export function useResource<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading', data: null, error: null })
  const [version, setVersion] = useState(0)

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
  }, [...deps, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { ...state, reload }
}

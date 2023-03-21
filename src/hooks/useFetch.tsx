import { useEffect, useState } from 'react'

type PokemonType = {
  name: string
}

const useFetch = (url?: string) => {
  const [data, setData] = useState<PokemonType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>()

  const fetcher = (url: string, method?: string, body?: any) => {
    setIsLoading(true)
    setError(null)
    fetch(url, { method: method, body: JSON.stringify(body) })
      .then((response) =>
        response.json())
      .then((data) => {
        setData(data.results)
      })
      .catch((error) => {
        setError(error)
        setData([])
      })
      .finally(() => {
        setIsLoading(false)
      })

  }

  useEffect(() => {
    if (url) {
      fetcher(url)
    }
  }, [])


  return { data, isLoading, error, fetcher }
}

export default useFetch
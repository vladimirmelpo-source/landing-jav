import { useState, useEffect } from 'react'
import { fetchTariffs } from '@/api/tariffs'
import type { Tariff } from '@/types/tariff'

export function useTariffs(): { items: Tariff[]; loading: boolean; error: Error | null } {
  const [items, setItems] = useState<Tariff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchTariffs()
      .then((res) => setItems(res.items ?? []))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { items, loading, error }
}

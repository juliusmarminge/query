import React from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Temporal } from '@js-temporal/polyfill'
import { ClientComponent, ClientComponent2 } from './client-component'
import { makeQueryClient, tson } from './make-query-client'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function Home() {
  const queryClient = makeQueryClient()

  void queryClient.prefetchQuery({
    queryKey: ['data'],
    queryFn: async () => {
      await sleep(2000)
      return tson.serialize({
        text: 'data from server',
        date: Temporal.PlainDate.from('2024-01-01'),
      })
    },
  })

  const promise = Promise.resolve(new Date()).then(tson.serialize)

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientComponent />
        <ClientComponent2 promise={promise} />
      </HydrationBoundary>
    </main>
  )
}

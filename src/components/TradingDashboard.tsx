import { Suspense } from 'react'
import { AccountCarousel } from './AccountCarousel'
import { ExchangeSection } from './ExchangeSection'
import { ExchangeSectionSkeleton } from './ExchangeSectionSkeleton'
import { TransactionsSection } from './TransactionsSection'

export function TradingDashboard() {
  return (
    <>
      <div className="mb-10 overflow-hidden lg:overflow-visible">
        <AccountCarousel />
      </div>
      <div className="relative">
        <Suspense fallback={<ExchangeSectionSkeleton />}>
          <ExchangeSection />
        </Suspense>
      </div>
      <Suspense fallback={<div style={{ minHeight: 1000 }}></div>}>
        <TransactionsSection />
      </Suspense>
    </>
  )
}

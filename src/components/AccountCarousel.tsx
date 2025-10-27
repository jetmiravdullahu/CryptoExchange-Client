import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import { BalanceCard } from './BalanceCard'
import { useGetAccountsQuery } from '@/hooks/api/Account/useGetAccounts'

export const AccountCarousel = () => {
  const { data: accounts } = useGetAccountsQuery()

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
          playOnInit: true,
          stopOnLastSnap: false,
          active: true,
        }),
      ]}
      className="min-w-full max-w-xs"
    >
      <CarouselContent>
        {accounts
          .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
          .map((account) => (
            <CarouselItem
              className="md:basis-1/2 lg:basis-1/3"
              key={account.id}
            >
              <BalanceCard
                currency={account.asset.name}
                balance={parseFloat(account.balance)}
              />
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

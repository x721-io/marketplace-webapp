import Image from 'next/image'
import Text from '@/components/Text'
import Icon from '@/components/Icon'
import Stepper from '@/components/Stepper'
import Button from '@/components/Button'
import Link from 'next/link'
import { Project, RoundType } from '@/types'
import { useRoundsWithStatus } from '@/hooks/useRoundStatus'
import { useMemo } from 'react'
import { formatDisplayedBalance } from '@/utils'
import { formatEther } from 'ethers'

interface Props {
  project: Project
}

export default function LaunchpadSlide({ project }: Props) {
  const { activeRound, activeRoundIndex, roundsWithStatus } = useRoundsWithStatus(project.rounds)

  const getIconName = (type: RoundType) => {
    switch (type) {
      case 'U2UMintRoundZero':
      case 'U2UPremintRoundZero':
        return 'round-zero'
      case 'U2UMintRoundWhitelist':
      case 'U2UPremintRoundWhitelist':
        return 'check'
      case 'U2UMintRoundFCFS':
      case 'U2UPremintRoundFCFS':
      default:
        return 'auction'
    }
  }

  const steps = useMemo(() => {
    return roundsWithStatus.map((round, index) => {
      return { label: round.name, value: index, icon: round.status === 'ENDED' ? 'check' : getIconName(round.type) }
    })
  }, [roundsWithStatus])

  return (
    <div className="flex justify-center desktop:gap-8 gap-7 flex-col tablet:flex-row desktop:flex-row">
      {/** Project Image **/}
      <Image
        width={384}
        height={384}
        src={project.banner}
        className="desktop:w-96 desktop:h-96 tablet:w-96 tablet:h-96 rounded-2xl w-full h-full"
        alt="" />

      <div className="flex flex-col justify-between">
        {/** Project descriptions **/}
        <div className="flex flex-col desktop:gap-10 tablet:gap-4 gap-4 desktop:mb-0 tablet:mb-0">
          <Text className="font-semibold desktop:text-5xl tablet:text-4xl text-3xl">
            Projects: {project.name}
          </Text>
          <div className="flex gap-3 items-center">
            <Icon name="u2u-logo" width={30} height={30} />
            <div className="desktop:h-full tablet:h-full h-[20px] bg-gray-500 w-[1px]" />
            <Text variant="body-16">
              <span className="text-secondary">Items:</span>
              {" "}{activeRound?.totalNftt === 0 ? 'Open Edition' : formatDisplayedBalance(activeRound?.totalNftt,0) || 0}
            </Text>
          </div>

          {/** Sale data **/}
          <div className="flex gap-10 items-center mb-6">
            <div className="flex items-center gap-1 tablet:gap-2 desktop:gap-2 flex-col">
              <Text className="text-secondary text-base desktop:text-xl tablet:text-xl">
                Round Price
              </Text>
              <div className="flex items-center gap-2">
                <Icon name="u2u-logo" width={30} height={30} />
                <Text className="font-semibold text-xl desktop:text-3xl tablet:text-3xl">
                  {formatDisplayedBalance(formatEther(activeRound?.price || 0),0)}
                </Text>
                <Text className="font-semibold text-tertiary text-lg desktop:text-2xl" >U2U</Text>
              </div>
            </div>

            <div className="flex items-center gap-1 tablet:gap-2 desktop:gap-2 flex-col">
              <Text className="text-secondary text-base desktop:text-xl tablet:text-xl">
                Items
              </Text>
              <Text className="font-semibold text-xl desktop:text-3xl tablet:text-3xl" >
                {activeRound?.totalNftt === 0 ? 'Open Edition' : formatDisplayedBalance(activeRound?.totalNftt,0) || 0}
              </Text>
            </div>
          </div>
        </div>

        {/** Project Rounds **/}
        <Stepper current={activeRoundIndex} steps={steps} />

        <Link className="flex items-center w-full justify-center "
              href={`/project/${project.id}`}>
          <Button className="w-full">
            Details
          </Button>
        </Link>
      </div>
    </div>
  )
}
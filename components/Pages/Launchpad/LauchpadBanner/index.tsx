import Image from 'next/image'
import Icon from '@/components/Icon'
import RoundContractInteractions from './RoundContractInteractions'
import Link from 'next/link'
import { Project } from '@/types'
import {useEffect, useMemo} from 'react'
import { formatUnits } from 'ethers'
import { useContractRead } from 'wagmi'
import { getRoundAbi } from '@/utils'

export default function ProjectPageBanner({ project }: { project: Project }) {
  const activeRound = useMemo(() => {
    const active = project.rounds.find(round => {
      return Date.now() >= new Date(round.start).getTime() && Date.now() <= new Date(round.end).getTime()
    })
    const next = project.rounds.find(round => {
      return Date.now() < new Date(round.start).getTime()
    })
    return active || next || project.rounds[0]
  }, [project])

  const { data: roundData } = useContractRead({
    address: activeRound.address,
    abi: getRoundAbi(activeRound),
    functionName: 'getRound',
    args: [],
    enabled: !!activeRound,
    watch: true
  })

  useEffect(()=> {
    console.log("----",roundData)
  },[roundData])

  return (
    <div className="flex items-stretch gap-10 justify-between flex-col desktop:flex-row tablet:flex-row">
      <div className="flex-1">
        <Image
          className="w-full max-w-[600px] h-auto rounded-2xl"
          width={512}
          height={512}
          src={project.banner}
          alt="" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col gap-4 mb-8">
          <p className="font-semibold text-heading-lg leading-none">
            Projects: {project.name}
          </p>

          <p className="text-secondary text-body-16">
            By <span className="text-primary font-medium">{project.organization}</span>
          </p>

          <div className="w-full flex desktop:items-center items-start gap-4 desktop:gap-0 justify-between flex-col desktop:flex-row">
            <div className="flex items-center gap-2">
              <Icon name="u2u-logo" width={24} height={24} />
              <div className="h-7 w-[1px] bg-surface-hard" />
              <p className="text-secondary text-body-16">
                Total
                Items: <span className="text-primary font-medium">{activeRound?.totalNftt || 'Open Edition'}</span>
              </p>
              <p className="text-secondary text-body-16">
                Total
                Minted: <span className="text-primary font-medium">{formatUnits((roundData as any)?.soldAmountNFT || 0, 0)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!!project.twitter && (
                <Link href={project.twitter}>
                  <Icon name="twitter" width={24} height={24} />
                </Link>
              )}
              {!!project.discord && (
                <Link href={project.discord}>
                  <Icon name="discord" width={24} height={24} />
                </Link>
              )}
              {!!project.telegram && (
                <Link href={project.telegram}>
                  <Icon name="telegram" width={24} height={24} />
                </Link>
              )}
              {!!project.website && (
                <Link href={project.website}>
                  <Icon name="website" width={24} height={24} />
                </Link>
              )}
            </div>
          </div>

          <p className="text-secondary text-body-14">
            {project.description}
          </p>
        </div>

        <RoundContractInteractions
          round={activeRound}
          collection={project.collection}
        />
      </div>
    </div>
  )
}
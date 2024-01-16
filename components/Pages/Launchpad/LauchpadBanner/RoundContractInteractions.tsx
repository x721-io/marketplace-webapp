import Icon from '@/components/Icon';
import {Collection, Round} from '@/types';
import {formatEther} from 'ethers';
import {formatDisplayedBalance, getRoundAbi} from '@/utils';
import RoundAction from './RoundAction';
import {useRoundStatus} from '@/hooks/useRoundStatus';
import {format} from 'date-fns';
import {
  useAccount,
  useContractRead,
} from 'wagmi';
import {useEffect} from "react";

interface Props {
  collection: Collection;
  round: Round;
}

export default function RoundContractInteractions({
                                                    round,
                                                    collection
                                                  }: Props) {
  const status = useRoundStatus(round);
  const {address} = useAccount();
  const {data: isWhitelisted} = useContractRead({
    address: round.address,
    abi: getRoundAbi(round),
    functionName: 'checkIsUserWhitelisted',
    args: [address],
    enabled: !!address && round.type !== 'U2UPremintRoundFCFS' && round.type !== 'U2UMintRoundFCFS',
    watch: true
  });

  useEffect(() => {
    console.log("------",round)
  }, [round])
  return (
     <div className="w-full rounded-lg bg-surface-soft flex flex-col gap-4 p-4">
       <div className="flex items-start justify-between flex-col desktop:flex-row gap-4 desktop:gap-0">
         <p className="text-heading-sm font-semibold">{round?.name}</p>

         {(() => {
           switch (status) {
             case 'MINTING':
               return (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1 rounded-full bg-success"/>

                    <div>
                      <p className="text-body-16 font-medium leading-none">
                        Minting: <span className="text-success">Live</span>
                      </p>
                      <p className="text-body-14 text-secondary">
                        End:{' '}
                        <span className="text-secondary">
                        {/*{format(round?.end || 0, 'yyyy/M/dd hh:mm a')}*/}
                      </span>
                      </p>
                    </div>
                  </div>
               );

             case 'UPCOMING':
               return (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1 rounded-full bg-warning"/>
                    <div>
                      <p className="text-body-16 font-medium leading-none">
                        Minting: <span className="text-warning">Upcoming</span>
                      </p>
                      <p className="text-body-14 text-secondary">
                        Start:{' '}
                        <span className="text-secondary">
                        {/*{format(round?.start || 0, 'yyyy/M/dd hh:mm a')}*/}
                      </span>
                      </p>
                    </div>
                  </div>
               );
             case 'ENDED':
               return (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1 rounded-full bg-error"/>

                    <div>
                      <p className="text-body-16 font-medium leading-none">
                        Minting: <span className="text-error">Ended</span>
                      </p>
                      <p className="text-body-14 text-secondary">
                        End:{' '}
                        <span className="text-secondary">
                        {/*{format(round?.end || 0, 'yyyy/M/dd hh:mm a')}*/}
                      </span>
                      </p>
                    </div>
                  </div>
               );
           }
         })()}
       </div>

       <div className="w-full h-[1px] bg-gray-200"/>

       <div className="flex items-start desktop:gap-10 gap-4 flex-col desktop:flex-row">
         <div className="flex flex-row desktop:flex-col items-center desktop:items-start gap-2">
           <p className="text-body-16 text-secondary font-medium ">Items</p>
           <p className="text-primary text-heading-sm font-semibold">
             {round?.totalNftt === 0 ? 'Open edition' : round?.totalNftt}
           </p>
         </div>

         <div className="flex flex-row desktop:flex-col items-center desktop:items-start gap-2">
           <p className="text-body-16 text-secondary font-medium">Price</p>
           <div className="flex items-center gap-2">
             <Icon name="u2u-logo" width={24} height={24}/>
             <p className="font-semibold text-body-16">
               {formatDisplayedBalance(formatEther(round?.price))}
             </p>
             <p className="text-tertiary text-body-16">U2U</p>
           </div>
         </div>

         <div className="flex flex-row desktop:flex-col items-center desktop:items-start gap-2">
           <p className="text-body-16 text-secondary font-medium">Max</p>
           <p className="text-primary text-body-16 font-semibold">
             {round?.maxPerWallet === 0 ? 'Unlimited' : (
                <>
                  {round?.maxPerWallet} items{' '}
                  <span className="text-secondary">per wallet</span>
                </>
             )}
           </p>
         </div>
       </div>

       <div className="w-full h-[1px] bg-gray-200"/>

       <RoundAction
          collection={collection}
          round={round}
          isWhitelisted={!!isWhitelisted}
       />
     </div>
  );
}

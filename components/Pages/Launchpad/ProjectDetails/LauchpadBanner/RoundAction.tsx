import Button from '@/components/Button';
import {
  Address,
  erc721ABI,
  useAccount,
  useBalance,
  useContractReads,
} from 'wagmi';
import { useMemo, useState } from 'react';
import { formatEther, formatUnits } from 'ethers';
import { toast } from 'react-toastify';
import { useWriteRoundContract } from '@/hooks/useRoundContract';
import { Collection, Round } from '@/types';
import { useRoundStatus } from '@/hooks/useRoundStatus';
import { format } from 'date-fns';
import { useRoundZero } from '@/hooks/useRoundZero';
import { MARKETPLACE_URL, ZERO_COLLECTION } from '@/config/constants';
import { MessageRoundNotEligible } from './EligibleMessage';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useLaunchpadApi } from '@/hooks/useLaunchpadApi';
import Link from 'next/link';
import { formatDisplayedBalance, getRoundAbi } from '@/utils';
import Icon from '@/components/Icon';
import { classNames, getCollectionLink } from '@/utils/string';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';

interface Props {
  collection: Collection;
  round: Round;
  isWhitelisted: boolean;
  isInTimeframe?: boolean;
  hasTimeframe?: boolean;
  isSpecial?: boolean;
}

export default function RoundAction({
  round,
  collection,
  isWhitelisted,
  isInTimeframe,
  hasTimeframe,
  isSpecial,
}: Props) {
  const api = useLaunchpadApi();
  const { address } = useAccount();
  const { data: balanceInfo } = useBalance({
    address,
    watch: true,
    enabled: !!address,
  });
  const { id } = useParams();
  const status = useRoundStatus(round);
  const { isSubscribed, onSubscribe } = useRoundZero(round);
  const { data: snapshot } = useSWR(
    address && id ? { userId: address, projectId: id } : null,
    (params) => api.fetchSnapshot(params),
    { refreshInterval: 3000 }
  );
  const hasStaked = useMemo(() => {
    return (
      BigInt(snapshot?.stakingTotal || 0) >= BigInt(round.requiredStaking || 0)
    );
  }, [snapshot, round]);

  const { data } = useContractReads({
    contracts: [
      {
        address: ZERO_COLLECTION as Address,
        abi: erc721ABI,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        address: round.address,
        abi: getRoundAbi(round),
        functionName: 'getAmountBought',
        args: [address],
      },
      {
        address: round.address,
        abi: getRoundAbi(round),
        functionName: 'getRound',
      },
      {
        address: ZERO_COLLECTION as Address,
        abi: erc721ABI,
        functionName: 'symbol',
      },
    ],
    watch: true,
    enabled: !!address,
    select: ([balanceNFT, amountBought, roundInfo, nftSymbol]) => [
      formatUnits(String(balanceNFT?.result), 0),
      formatUnits(String(amountBought?.result), 0),
      roundInfo?.result,
      nftSymbol?.result,
    ],
  });

  const [balanceNFT, amountBought, roundInfo, nftSymbol] = useMemo(
    () => data || [],
    [data]
  );
  const isHolder = useMemo(() => {
    return Number(balanceNFT) > 0;
  }, [balanceNFT]);

  const maxAmountNFT = (roundInfo as any)?.maxAmountNFT;
  const soldAmountNFT = (roundInfo as any)?.soldAmountNFT;
  const roundType = (roundInfo as any)?.roundType;
  const maxAmountNFTPerWallet = (roundInfo as any)?.maxAmountNFTPerWallet;
  const startClaim = (roundInfo as any)?.startClaim;
  const price = (roundInfo as any)?.price;

  const eligibleStatus = useMemo(() => {
    if (
      round.type === 'U2UPremintRoundZero' ||
      round.type === 'U2UMintRoundZero'
    ) {
      return hasStaked || isHolder;
    }

    if (
      round.type === 'U2UMintRoundFCFS' ||
      round.type === 'U2UPremintRoundFCFS'
    ) {
      return true;
    }

    return isWhitelisted;
  }, [hasStaked, round, isHolder, isWhitelisted]);

  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await onSubscribe();
      toast.success('Subscribed to this project');
    } catch (e: any) {
      toast.error(`Error report: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const { onBuyNFT, onBuyNFTCustomized } = useWriteRoundContract(round, collection);
  const handleBuyNFT = async () => {
    if (
      !balanceInfo ||
      !balanceInfo?.value ||
      balanceInfo.value < BigInt(round.price)
    ) {
      toast.error('Not enough U2U balance');
      return;
    }

    try {
      setLoading(true);
      const { waitForTransaction, hash } = isSpecial
        ? await onBuyNFTCustomized()
        : collection.type === 'ERC721'
        ? await onBuyNFT()
        : await onBuyNFT(amount);
      await waitForTransaction();
      toast.success('Your item has been successfully purchased!');
      api.crawlNFTInfo({
        txCreation: hash,
        collectionAddress: collection.address,
      });
    } catch (e: any) {
      toast.error(`Error report: ${e?.message || e}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [amount, setAmount] = useState(1);

  const estimatedCost = useMemo(() => {
    const totalCostBN = BigInt(round.price || 0) * BigInt(amount || 0);
    const totalCost = formatEther(totalCostBN);
    return formatDisplayedBalance(totalCost);
  }, [round, amount]);

  const handleAddAmount = (num: number) => {
    handleInputAmount(amount + num);
  };

  const handleInputAmount = (value: number) => {
    if (!address) {
      toast.warning('Please connect your wallet first');
      return;
    }

    if (value < 0) return;

    if (value > amount) {
      if (
        !balanceInfo ||
        !balanceInfo?.value ||
        balanceInfo.value < BigInt(round.price) * BigInt(value)
      ) {
        toast.error('Not enough U2U balance');
        return;
      }
    }
    setAmount(value);
  };

  const renderRoundAction = () => {
    switch (status) {
      case 'MINTING':
        return (
          <>
            {(round.type === 'U2UPremintRoundZero' ||
              round.type === 'U2UMintRoundZero' ||
              round.type === 'U2UPremintRoundWhitelist' ||
              round.type === 'U2UMintRoundWhitelist') && (
              <MessageRoundNotEligible eligibleStatus={eligibleStatus} />
            )}
            <div className='flex w-full gap-2 flex-col tablet:flex-row justify-between items-start'>
              {(collection.type === 'ERC1155') ? (
                <div className='flex-1 flex items-center gap-3'>
                  <div className='flex max-w-fit items-center px-4 py-3 gap-4 bg-surface-medium rounded-lg'>
                    <div onClick={() => handleAddAmount(-1)}>
                      <Icon
                        className='cursor-pointer text-secondary'
                        name='minus'
                        width={24}
                        height={24}
                      />
                    </div>

                    <input
                      value={amount}
                      onChange={(e) =>
                        handleInputAmount(Number(e.target.value))
                      }
                      className='border-none overflow-visible bg-transparent w-10 text-center p-0 outline-none text-body-18 font-medium'
                    />
                    <div onClick={() => handleAddAmount(1)}>
                      <Icon
                        className='cursor-pointer text-secondary'
                        name='plus'
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                  <p className='text-body-16 text-secondary'>
                    Total:{' '}
                    <span className='text-primary font-semibold'>
                      {estimatedCost} U2U
                    </span>
                  </p>
                </div>
              ) : (
                <div className='flex-1'>
                  <p className='text-body-12 text-secondary'>
                    Minted: {amountBought}
                    <span className='text-primary font-semibold'>
                      /{round.maxPerWallet}
                    </span>
                  </p>
                </div>
              )}
              <div className='flex-1 w-full'>
                <ConnectWalletButton scale='lg' className='w-full'>
                  <Button
                    disabled={
                      roundType == '2' &&
                      Number(maxAmountNFT) == 0 &&
                      Number(maxAmountNFTPerWallet) == 0 &&
                      Number(startClaim) == 0 &&
                      Number(price) == 0
                        ? false
                        : (Number(amountBought) === round.maxPerWallet &&
                          round.maxPerWallet != 0) ||
                        (maxAmountNFT == soldAmountNFT && maxAmountNFT != 0) ||
                        !eligibleStatus ||
                        (!isInTimeframe && hasTimeframe)
                    }
                    scale='lg'
                    className='w-full'
                    onClick={handleBuyNFT}
                    loading={loading}
                  >
                    {Number(amountBought) > 0 &&
                    Number(amountBought) < round.maxPerWallet
                      ? 'Mint another'
                      : 'Mint Now'}
                  </Button>
                </ConnectWalletButton>
              </div>

            </div>
          </>
        );
      case 'UPCOMING':
        return (
          <div className='flex flex-col gap-4'>
            <p className='text-body-14 text-secondary'>
              Minting starts:{' '}
              <span className='text-primary font-semibold'>
                {format(new Date(round.start || 0), 'yyyy/M/dd - hh:mm a')}
              </span>
            </p>

            {round.type === 'U2UPremintRoundZero' ||
            round.type === 'U2UMintRoundZero' ? (
              <ConnectWalletButton scale='lg' className='w-full'>
                {!isSubscribed ? (
                  <Button
                    scale='lg'
                    className='w-full'
                    onClick={handleSubscribe}
                    loading={loading}
                  >
                    Subscribe now
                  </Button>
                ) : (
                  <div className='flex flex-col gap-3'>
                    <MessageRoundNotEligible eligibleStatus={eligibleStatus} />

                    <div className='flex flex-col desktop:flex-row gap-2 items-stretch'>
                      <div
                        className={classNames(
                          'desktop:w-1/2 border-2 rounded-2xl transition-all p-4 flex flex-col gap-1',
                          hasStaked
                            ? ' border-success'
                            : 'border-dashed border-gray-500/70 hover:border-gray-500 hover:border-solid'
                        )}
                      >
                        <p className='font-semibold text-center text-body-18'>
                          Stake U2U to join
                        </p>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium text-right'>
                            Current (snapshot at{' '}
                            {new Date(
                              snapshot?.lastDateRecord as Date
                            ).toLocaleDateString()}
                            ):
                          </p>

                          <p className='text-primary font-semibold text-right'>
                            {formatDisplayedBalance(
                              formatEther(snapshot?.stakingTotal || 0)
                            )}{' '}
                            U2U
                          </p>
                        </div>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium'>
                            Required:
                          </p>
                          <p className='text-primary font-semibold text-right'>
                            {formatDisplayedBalance(
                              formatEther(round.requiredStaking)
                            )}{' '}
                            U2U
                          </p>
                        </div>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium'>
                            Stake before:
                          </p>
                          <p className='text-primary font-semibold text-right'>
                            {format(
                              new Date(round.stakeBefore || 0),
                              'yyyy/M/dd - hh:mm a O'
                            )}
                          </p>
                        </div>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium'>Status:</p>
                          <div className='text-primary font-semibold'>
                            {hasStaked ? (
                              <div className='flex items-center gap-1'>
                                <Icon name='verified' />
                                <span className='text-success'>Qualified</span>
                              </div>
                            ) : (
                              <div className='flex items-center gap-1'>
                                <span className='text-error'>
                                  Not Qualified
                                </span>{' '}
                                |{' '}
                                <Link
                                  href='https://staking.uniultra.xyz/'
                                  className='hover: underline'
                                  target='_blank'
                                >
                                  Stake more
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className='text-xs text-secondary italic'>
                          Update 12:00 AM UTC everyday
                        </p>
                      </div>

                      <div
                        className={classNames(
                          'desktop:w-1/2 order-1 border-2 rounded-2xl transition-all p-4',
                          isHolder
                            ? ' border-success'
                            : 'border-dashed border-gray-500/70 hover:border-gray-500 hover:border-solid'
                        )}
                      >
                        <p className='font-semibold text-center text-body-18'>
                          Zero Collection
                        </p>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium'>
                            Condition:
                          </p>
                          <p className='text-primary font-semibold'>
                            Own Zero Collection
                          </p>
                        </div>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium'>
                            Currently own:
                          </p>
                          <p className='text-primary font-semibold'>
                            {balanceNFT} items
                          </p>
                        </div>

                        <div className='flex items-center justify-between text-body-12'>
                          <p className='text-secondary font-medium'>Status:</p>
                          <div className='text-primary font-semibold'>
                            {isHolder ? (
                              <div className='flex items-center gap-1'>
                                <Icon name='verified' />
                                <span className='text-success'>
                                  Qualified
                                </span>{' '}
                                |{' '}
                                <Link
                                  href={
                                    MARKETPLACE_URL +
                                    `/collection/${ZERO_COLLECTION}`
                                  }
                                  className='hover: underline'
                                  target='_blank'
                                >
                                  Get more
                                </Link>
                              </div>
                            ) : (
                              <div className='flex items-center gap-1'>
                                <span className='text-error'>
                                  Not Qualified
                                </span>{' '}
                                |{' '}
                                <Link
                                  href={
                                    MARKETPLACE_URL +
                                    `/collection/${ZERO_COLLECTION}`
                                  }
                                  className='hover: underline'
                                  target='_blank'
                                >
                                  Get now
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button scale='lg' disabled className='w-full'>
                      You have already subscribed!
                    </Button>
                  </div>
                )}
              </ConnectWalletButton>
            ) : round.type === 'U2UPremintRoundWhitelist' ||
              round.type === 'U2UMintRoundWhitelist' ? (
              <div>
                <MessageRoundNotEligible eligibleStatus={eligibleStatus} />
                {!eligibleStatus && (
                  <p className='font-semibold text-secondary italic text-body-12'>
                    Follow these{' '}
                    <Link
                      className='text-primary hover:underline'
                      href={round.instruction}
                      target='_blank'
                    >
                      instructions
                    </Link>{' '}
                    to get whitelisted.
                  </p>
                )}
              </div>
            ) : (
              <ConnectWalletButton scale='lg' className='w-full'>
                <Button disabled scale='lg' className='w-full'>
                  Mint now
                </Button>
              </ConnectWalletButton>
            )}
          </div>
        );
      case 'ENDED':
        return (
          <div className='w-full'>
            <div className='text-error font-semidbold text-center text-body-18 p-4'>
              Round has Ended
            </div>
            <Link href={getCollectionLink(collection)}>
              <Button className='w-full'>Explore collection</Button>
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return renderRoundAction();
}
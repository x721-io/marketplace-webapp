import Collapsible from '@/components/Collapsible';
import useTimeframeStore from '@/store/timeframe/store';
import { Timeframe } from '@/types';
import { useMemo, useState } from 'react';
import { classNames } from '@/utils/string';
import Icon from '@/components/Icon';
import DropdownCustomized from './DropdownCustomized';

export default function TimeframeDropdown() {
  const [open, setOpen] = useState(false);
  const { timeframes } = useTimeframeStore((state) => state);
  const currentTimeframe = useMemo(() => {
    let current = { index: 0, isInTimeframe: false };
    const timeframesStart =
      timeframes[0].hourStart * 3600 + timeframes[0].minuteStart * 60;
    const timeframesEnd =
      timeframes[timeframes.length - 1].hourEnd * 3600 +
      timeframes[timeframes.length - 1].minuteEnd * 60;
    const currentTime =
      new Date().getUTCHours() * 3600 + new Date().getMinutes() * 60;
    if (currentTime < timeframesStart) {
      return { index: 0, isInTimeframe: false };
    }

    for (let i = 0; i < timeframes.length; i++) {
      const start =
        timeframes[i].hourStart * 3600 + timeframes[i].minuteStart * 60;
      const end = timeframes[i].hourEnd * 3600 + timeframes[i].minuteEnd * 60;

      if (currentTime >= start && currentTime <= end) {
        current = { index: i, isInTimeframe: true };
        break;
      }
      if (i < timeframes.length - 1) {
        const startNext =
          timeframes[i + 1].hourStart * 3600 +
          timeframes[i + 1].minuteStart * 60;
        if (currentTime > end && currentTime < startNext) {
          current = { index: i + 1, isInTimeframe: false };
          break;
        }
      }
    }

    if (currentTime > timeframesEnd) {
      return { index: timeframes.length - 1, isInTimeframe: false };
    }
    return current;
  }, [timeframes]);
  console.log('currentTimeframe: ',currentTimeframe);

  const formatTimeframe = (timeframe: Timeframe) => {
    return (
      <span className='flex-1'>
        {timeframe.hourStart < 10
          ? `0${timeframe.hourStart}`
          : timeframe.hourStart}
        :
        {timeframe.minuteStart < 10
          ? `0${timeframe.minuteStart}`
          : timeframe.minuteStart}{' '}
        - {timeframe.hourEnd < 10 ? `0${timeframe.hourEnd}` : timeframe.hourEnd}
        :
        {timeframe.minuteEnd < 10
          ? `0${timeframe.minuteEnd}`
          : timeframe.minuteEnd}{' '}
        UTC
      </span>
    );
  };

  return (
    // <Collapsible
    //   header={
    //     <div className='flex items-center gap-4'>
    //       {currentTimeframe.isInTimeframe && (
    //         <div className='w-2 h-2 rounded-full bg-success' />
    //       )}
    //       {formatTimeframe(timeframes[currentTimeframe.index])}
    //     </div>
    //   }
    //   className='bg-white rounded-2xl overflow-auto'
    // >
    //   {timeframes.map((timeframe, index) =>
    //     index == currentTimeframe.index ? (
    //       <div className='flex items-center gap-4' key={index}>
    //         <div className='w-2 h-2 rounded-full bg-success' />
    //         <p key={index}>{formatTimeframe(timeframe)}</p>
    //       </div>
    //     ) : index <= currentTimeframe.index ? (
    //       <div className='flex items-center gap-4' key={index}>
    //         <div className='w-2 h-2 rounded-full bg-disabled' />
    //         <p key={index}>{formatTimeframe(timeframe)}</p>
    //       </div>
    //     ) : (
    //       <div className='flex items-center gap-4' key={index}>
    //         <div className='w-2 h-2 rounded-full bg-warning' />
    //         <p key={index}>{formatTimeframe(timeframe)}</p>
    //       </div>
    //     )
    //   )}
    // </Collapsible>
    <DropdownCustomized
      activator={
        <div className='flex items-center gap-4 pt-3 pl-4 pr-4'>
          {currentTimeframe.isInTimeframe && (
            <div className='w-2 h-2 rounded-full bg-success' />
          )}
          {formatTimeframe(timeframes[currentTimeframe.index])}
          <div
            className={classNames(
              'rounded-lg p-1 bg-surface-medium transition-transform',
              open && 'rotate-180'
            )}
          >
            <Icon name='chevronDown' width={14} height={14} className='grow' />
          </div>
        </div>
      }
      dropdown={timeframes.map((timeframe, index) =>
        currentTimeframe.index == index && currentTimeframe.isInTimeframe ? (
          <div className='flex items-center gap-4' key={index}>
            <div className='w-2 h-2 rounded-full bg-success' />
            <p key={index}>{formatTimeframe(timeframe)}</p>
          </div>
        ) : currentTimeframe.index >= index ? (
          <div className='flex items-center gap-4' key={index}>
            <div className='w-2 h-2 rounded-full bg-disabled' />
            <p key={index}>{formatTimeframe(timeframe)}</p>
          </div>
        ) : (
          <div className='flex items-center gap-4' key={index}>
            <div className='w-2 h-2 rounded-full bg-warning' />
            <p key={index}>{formatTimeframe(timeframe)}</p>
          </div>
        )
      )}
      className='bg-white rounded-2xl h-12'
      open={open}
      setOpen={setOpen}
    />
  );
}

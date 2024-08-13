'use client';

import { useEffect, useState } from 'react';

type Props = {
  content: string;
  children: React.ReactNode;
  placement: 'top' | 'bottom';
};

const Tooltip: React.FC<Props> = ({ children, placement, content }) => {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  useEffect(() => {
    switch (placement) {
      case 'top':
        break;
      case 'bottom':
        break;
    }
  }, [placement]);

  return (
    <div className='relative'>
      <div className='absolute bg-[black] -top-[100px]'>{content}</div>
      {children}
    </div>
  );
};

export default Tooltip;

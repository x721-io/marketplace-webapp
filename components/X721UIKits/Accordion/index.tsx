'use client';

import { useState } from 'react';

type AccordionRootProps = {
  collapseAll?: boolean;
  title: string;
  children: React.ReactNode;
};

type AccordionContentProps = {
  children: React.ReactNode;
};

const Root: React.FC<AccordionRootProps> = ({
  collapseAll,
  title = "",
  children,
}) => {
  const [isCollapseAll, setCollapseAll] = useState(collapseAll);

  return (
    <div className='w-full border-solid border-[1px] border-[#E0E0E0] rounded-md  pb-[20px]'>
      <div
        onClick={() => setCollapseAll(!isCollapseAll)}
        style={{
          borderBottom: isCollapseAll ? 'none' : '1px solid #E0E0E0',
          paddingBottom: isCollapseAll ? '0px' : '20px',
          background: isCollapseAll ? 'transparent' : '#F5F5F5',
          opacity: isCollapseAll ? 0.5 : 1
        }}
        className='w-full px-[20px]  cursor-pointer pt-[20px]'
      >
        {title}
      </div>
      {!isCollapseAll && <div className='px-[20px] py-[20px]'>{children}</div>}
    </div>
  );
};

const Content: React.FC<AccordionContentProps> = ({ children }) => {
  return <div className='w-full'>{children}</div>;
};

export const Accordion = {
  Root: Root,
  Content: Content,
};

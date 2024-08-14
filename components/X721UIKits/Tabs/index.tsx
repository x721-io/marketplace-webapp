'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type TabsRootProps = {
  onActiveTabChange: (tabIndex: number) => void;
  children: React.ReactNode;
};

type TabsContextType = {
  onTabClick: ((tabIndex: number) => void) | null;
};

const TabsContext = createContext<TabsContextType>({
  onTabClick: null,
});

const TabsGroup: React.FC<TabsRootProps> = ({
  children,
  onActiveTabChange,
}) => {
  const onTabClick = (tabIndex: number) => {
    onActiveTabChange(tabIndex);
  };
  return (
    <TabsContext.Provider value={{ onTabClick }}>
      <div className='flex flex-row bg-[#eeeeeed9] p-[5px] rounded-md'>{children}</div>
    </TabsContext.Provider>
  );
};

const TabItem = ({
  children,
  tabIndex,
  active,
}: {
  children: React.ReactNode;
  tabIndex: number;
  active: boolean;
}) => {
  const { onTabClick } = useContext(TabsContext);
  return (
    <div
      className='h-full flex-1 flex items-center justify-center cursor px-[15px] py-[12px] rounded-md cursor-pointer'
      style={{
        background: active ? 'white' : 'transparent',
        boxShadow: active ? '0 0 10px 0 rgba(0,0,0,0.1)' : 'none',
      }}
      onClick={() => onTabClick && onTabClick(tabIndex)}
    >
      {children}
    </div>
  );
};

export const MyTabs = {
  Group: TabsGroup,
  Item: TabItem,
};

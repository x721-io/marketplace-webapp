"use client";

import { createContext, useContext } from "react";

type TabsRootProps = {
  onActiveTabChange: (tabIndex: number) => void;
  style?: "default" | "underline";
  children: React.ReactNode;
};

type TabsContextType = {
  onTabClick: ((tabIndex: number) => void) | null;
  style: "default" | "underline";
};

const TabsContext = createContext<TabsContextType>({
  onTabClick: null,
  style: "default",
});

const TabsGroup: React.FC<TabsRootProps> = ({
  children,
  onActiveTabChange,
  style = "default",
}) => {
  const onTabClick = (tabIndex: number) => {
    onActiveTabChange(tabIndex);
  };

  const getStyleByTabStyle = () => {
    switch (style) {
      case "default":
        return {
          background: "#f5f5f5",
          borderRadius: "16px",
          padding: "5px",
        };
      case "underline":
        return {
          borderBottom: "1px solid #E3E3E3",
        };
    }
  };

  return (
    <TabsContext.Provider value={{ onTabClick, style }}>
      <div
        style={getStyleByTabStyle()}
        className="flex flex-row overflow-x-auto max-w-full no-scrollbar"
      >
        {children}
      </div>
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
  const { onTabClick, style } = useContext(TabsContext);

  const getStyleByTabStyle = () => {
    switch (style) {
      case "default":
        return {
          background: active ? "white" : "transparent",
          boxShadow: active ? "0 0 10px 0 rgba(0,0,0,0.1)" : "none",
          borderRadius: "12px",
        };
      case "underline":
        return {
          borderBottom: active ? "2px solid #252525" : "none",
          opacity: active ? 1 : 0.5,
        };
    }
  };

  return (
    <div
      className="h-full flex items-center justify-center cursor px-[15px] py-[12px] cursor-pointer max-[768px]:flex-1"
      style={getStyleByTabStyle()}
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

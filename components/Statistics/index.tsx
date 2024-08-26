"use client";

import StatisticsHeader from "./header";
import CollectionsTable from "./table";

type Props = {};

const Statistics: React.FC<Props> = () => {
  return (
    <div className="flex justify-center gap-14 desktop:gap-0 tablet:gap-0 flex-col-reverse tablet:flex-row desktop:flex-row w-full px-4 py-8 tablet:px-20 tablet:py-8 desktop:px-20 desktop:py-8">
      <div className="w-full p-5 rounded-xl border border-1 border-soft shadow-sm flex flex-col gap-5">
        <StatisticsHeader />
        <CollectionsTable />
      </div>
    </div>
  );
};

export default Statistics;

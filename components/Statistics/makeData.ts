import { faker } from "@faker-js/faker";

export type CollectionChartItem = {
  index: number;
  name: string;
  floorPrice: number;
  floorChange: number;
  volume: number;
  volumeChange: number;
  itemsAmt: number;
  ownersAmt: number;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newCollecionItem = (index: number): CollectionChartItem => {
  return {
    index,
    name: faker.person.firstName(),
    floorPrice: faker.number.int(100),
    floorChange: faker.number.int(100),
    volume: faker.number.int(100),
    volumeChange: faker.number.int(100),
    itemsAmt: faker.number.int(100),
    ownersAmt: faker.number.int(100),
  };
};

export function makeData(...lens: number[]) {
  let index = 0;
  const makeDataLevel = (depth = 0): CollectionChartItem[] => {
    const len = lens[depth]!;
    return range(len).map((_d): CollectionChartItem => {
      index++;
      return {
        ...newCollecionItem(index),
      };
    });
  };

  return makeDataLevel();
}

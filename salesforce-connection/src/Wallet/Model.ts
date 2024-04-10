import type { SkPath } from "@shopify/react-native-skia";

import { curveLines } from "./Math";

export const PADDING = 16;

export const COLORS = ["#F69D69", "#FFC37D", "#61E0A1", "#31CBD1"];

interface Amount {
  amount: string;
  currency: string;
  scale: string;
}

interface PercentChange {
  hour: number;
  day: number;
  week: number;
  month: number;
  year: number;
}

interface LatestPrice {
  amount: Amount;
  timestamp: string;
  percent_change: PercentChange;
}

export type PriceList = [string, number][];

export interface DataPoints {
  percent_change: number;
  prices: PriceList;
}

export interface Prices {
  latest: string;
  latest_price: LatestPrice;
  hour: DataPoints;
  day: DataPoints;
  week: DataPoints;
  month: DataPoints;
  year: DataPoints;
  all: DataPoints;
}

const POINTS = 20;

const buildGraph = (
  datapoints: DataPoints,
  label: string,
  WIDTH: number,
  HEIGHT: number
) => {
  const AJUSTED_SIZE = HEIGHT - PADDING * 2;
  const priceList = datapoints.prices.slice(0, POINTS);
  const formattedValues = priceList
    .map((price) => [parseFloat(price[0]), price[1]] as [number, number])
    .reverse();
  const prices = formattedValues.map((value) => value[0]);
  const dates = formattedValues.map((value) => value[1]);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const points = formattedValues.map(([price, date]) => {
    const x = ((date - minDate) / (maxDate - minDate)) * WIDTH;
    const y = ((price - minPrice) / (maxPrice - minPrice)) * AJUSTED_SIZE;
    return { x, y };
  });
  points.push({ x: WIDTH + 10, y: points[points.length - 1].y });
  const path = curveLines(points, 0.1, "complex");
  return {
    label,
    minPrice,
    maxPrice,
    percentChange: datapoints.percent_change,
    path,
  };
};

export interface Graph {
  label: string;
  value: number;
  data: {
    label: string;
    minPrice: number;
    maxPrice: number;
    percentChange: number;
    path: SkPath;
  };
}

export type Graphs = Graph[];

export const getGraph = (width: number, height: number, graphsData: Prices) => [
  {
    label: "1H",
    value: 0,
    data: buildGraph(graphsData.hour, "Last Hour", width, height),
  },
  {
    label: "1D",
    value: 1,
    data: buildGraph(graphsData.day, "Today", width, height),
  },
  {
    label: "1M",
    value: 2,
    data: buildGraph(graphsData.month, "Last Month", width, height),
  },
  {
    label: "1Y",
    value: 3,
    data: buildGraph(graphsData.year, "This Year", width, height),
  },
  {
    label: "All",
    value: 4,
    data: buildGraph(graphsData.all, "All time", width, height),
  },
];

export type GraphIndex = 0 | 1 | 2 | 3 | 4;

import React, { useEffect, useMemo, useState } from "react";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
} from "react-vis";
import Candlestick from "./CandlestickSeries";

type Data = {
  name?: string | number;
  min: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  max: number;
  average: number;
  mark?: number;
  ok?: number;
};

function useTransform(data: string) {
  return useMemo(() => {
    const [head, ...tail] = data
      .trim()
      .split("\n")
      .map((row) => row.split(/\s+/));

    const series: Data[] = tail.map(
      (row) =>
        Object.fromEntries(row.map((x, i) => [head[i], parseFloat(x)])) as Data
    );
    return series.map((v, i) => ({
      x: i,
      y: v.mark || v.average,
      ...v,
      size: 500,
    }));
  }, [data]);
}

function genBoldTicks(min: number, max: number) {
  const result: number[] = [];
  const minlog10 = Math.floor(Math.log10(min));
  const maxlog10 = Math.floor(Math.log10(max));
  const maxunit = 10 ** maxlog10;
  const unit = 10 ** (maxlog10 - 1);
  const x5 = 5 * unit;
  if (min < x5) {
    result.push(x5);
  }
  if (minlog10 < maxlog10) {
    result.push(maxunit);
  }
  for (let cur = maxunit + x5; cur < max; cur += x5) {
    result.push(cur);
  }
  return result;
}
function genThinTicks(_min: number, max: number) {
  const result: number[] = [];
  const maxlog10 = Math.floor(Math.log10(max));
  const unit = 10 ** (maxlog10 - 1);
  for (let i = 1; i * unit < max; i += 1) {
    if (i % 5) result.push(i * unit);
  }
  return result;
}

const defaultValue = `name min lowerQuartile median upperQuartile max average mark ok
title1 100 200 300 400 500 250 350 1
title2 100 200 300 400 500 250 350 -1
title3 100 200 300 400 500 250 350 0
`;

export default function App() {
  const [dataStr, setData] = useState(defaultValue);
  const [yMin, setYMin] = useState(0);
  const [yMax, setYMax] = useState(100);
  const seed = useTransform(dataStr);
  useEffect(() => {
    if (seed.length > 0) {
      setYMin(Math.min(...seed.map((x) => x.min)) * 0.8);
      setYMax(Math.max(...seed.map((x) => x.max)) * 1.2);
    }
  }, [seed]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div>
        <p>
          format: multispace separated value
          <br />
          header row must be values listed below(unordered, parseFloat will be
          applied):
          <pre>
            name min lowerQuartile median upperQuartile max average mark ok
          </pre>
        </p>
        <textarea
          style={{ width: 640, height: "4em" }}
          value={dataStr}
          onChange={(e) => setData(e.currentTarget.value)}
        ></textarea>
        <label>
          yMin
          <input
            type="number"
            value={yMin}
            onChange={(e) => setYMin(e.currentTarget.valueAsNumber || 0)}
          ></input>
        </label>
        <label>
          yMax
          <input
            type="number"
            value={yMax}
            onChange={(e) => setYMax(e.currentTarget.valueAsNumber || 0)}
          ></input>
        </label>
      </div>
      <div style={{ position: "relative", flexGrow: 1 }}>
        <FlexibleWidthXYPlot
          animation
          yDomain={[yMin, yMax]}
          xDomain={[0, seed.length]}
          height={800}
        >
          <XAxis tickFormat={(x: number) => seed[x]?.name ?? ""} left={80} />
          <YAxis />
          <HorizontalGridLines
            style={{ stroke: "#ddd", strokeDasharray: "8 12" }}
            tickValues={genThinTicks(yMin, yMax)}
          />
          <HorizontalGridLines
            style={{ stroke: "#bbb", strokeDasharray: "4 4" }}
            tickValues={genBoldTicks(yMin, yMax)}
          />
          <Candlestick
            colorType="literal"
            opacityType="literal"
            stroke="#79C7E3"
            fill="#FF9833"
            markOkStroke="#ff2929"
            markNgStroke="#2929ff"
            data={seed}
          />
        </FlexibleWidthXYPlot>
      </div>
    </div>
  );
}

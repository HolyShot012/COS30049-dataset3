import React from "react";
import * as d3 from "d3";

type HistogramProps = {
    width: number;
    height: number;
    data: number[];
  };
  
export const Histogram = ({ width, height, data }: HistogramProps) => {
  
    // read the data
    // build buckets from the dataset
    // build the scales
    // build the rectangles
  
return (
  <div>
    <svg width={width} height={height}>
      // render all the <rect>
    </svg>
  </div>
);
};
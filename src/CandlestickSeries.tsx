import { AbstractSeries } from "react-vis";

const predefinedClassName =
  "rv-xy-plot__series rv-xy-plot__series--candlestick";

class CandlestickSeries extends AbstractSeries {
  render() {
    const { className, data, marginLeft, marginTop } = this.props;
    if (!data) {
      return null;
    }

    const xFunctor = this._getAttributeFunctor("x");
    const yFunctor = this._getAttributeFunctor("y");
    const strokeFunctor =
      this._getAttributeFunctor("stroke") || this._getAttributeFunctor("color");
    const fillFunctor =
      this._getAttributeFunctor("fill") || this._getAttributeFunctor("color");
    const opacityFunctor = this._getAttributeFunctor("opacity");

    const distance = Math.abs(xFunctor(data[1]) - xFunctor(data[0])) * 0.2;

    return (
      <g
        className={`${predefinedClassName} ${className}`}
        transform={`translate(${marginLeft},${marginTop})`}
      >
        {data.map((d: any, i: number) => {
          const xTrans = xFunctor(d);
          const yHigh = yFunctor({ ...d, y: d.max });
          const yOpen = yFunctor({ ...d, y: d.upperQuartile });
          const yClose = yFunctor({ ...d, y: d.lowerQuartile });
          const yLow = yFunctor({ ...d, y: d.min });
          const yMark = yFunctor({ ...d, y: d.mark });
          const yAverage = yFunctor({ ...d, y: d.average });
          const yMedian = yFunctor({ ...d, y: d.median });
          const ok = d.ok ?? 0;

          const lineAttrs = {
            stroke: strokeFunctor?.(d),
          };
          const markOkAttrs = {
            stroke: this.props.markOkStroke || strokeFunctor?.(d),
          };
          const markNgAttrs = {
            stroke: this.props.markNgStroke || strokeFunctor?.(d),
          };

          const xWidth = distance * 2;
          return (
            <g
              key={i}
              transform={`translate(${xTrans + xWidth})`}
              opacity={opacityFunctor ? opacityFunctor(d) : 1}
              onClick={(e) => this._valueClickHandler(d, e)}
              onMouseOver={(e) => this._valueMouseOverHandler(d, e)}
              onMouseOut={(e) => this._valueMouseOutHandler(d, e)}
            >
              <line
                x1={-xWidth}
                x2={xWidth}
                y1={yHigh}
                y2={yHigh}
                {...lineAttrs}
              />
              <line x1={0} x2={0} y1={yHigh} y2={yLow} {...lineAttrs} />
              <line
                x1={-xWidth}
                x2={xWidth}
                y1={yLow}
                y2={yLow}
                {...lineAttrs}
              />
              <rect
                x={-xWidth}
                width={Math.max(xWidth * 2, 0)}
                y={yOpen}
                height={Math.abs(yOpen - yClose)}
                fill={fillFunctor?.(d)}
              />
              {typeof yMark === "number" && (
                <line
                  x1={-xWidth}
                  x2={xWidth}
                  y1={yMark}
                  y2={yMark}
                  strokeWidth={4}
                  {...(ok > 0 ? markOkAttrs : ok < 0 ? markNgAttrs : lineAttrs)}
                />
              )}
              <line
                x1={-xWidth * 1.2}
                x2={xWidth * 1.2}
                y1={yAverage}
                y2={yAverage}
                strokeDasharray="6 6"
                {...lineAttrs}
              />
              <line
                x1={-xWidth}
                x2={xWidth}
                y1={yMedian}
                y2={yMedian}
                strokeDasharray="6 2 6 2"
                {...lineAttrs}
              />
            </g>
          );
        })}
      </g>
    );
  }
}

CandlestickSeries.displayName = "CandlestickSeries";

export default CandlestickSeries as any;

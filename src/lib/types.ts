import type { InferInput, InferOutput } from 'valibot';
import type {
  AnnotationSchema,
  ArrowSchema,
  AxisConfigSchema,
  AxisOptionsSchema,
  ChartPositionSchema,
  ColumnDefinitionSchema,
  ColumnTypesSchema,
  DataRecordsSchema,
  DataSetSchema,
  DataSourceSchema,
  DeletableSchema,
  HighlightSchema,
  SeriesLineSchema,
  SeriesSchema,
  VisualisationSchema,
  VisualisationStateSchema
} from './schemas';

import type { ScaleLinear } from 'd3-scale';

export type DataRecordsType = InferOutput<typeof DataRecordsSchema>;
export type DataSetType = InferOutput<typeof DataSetSchema>;
export type DeletableType = InferOutput<typeof DeletableSchema>;
export type VisualisationType = InferOutput<typeof VisualisationSchema>;
export type VisualisationStateType = InferOutput<typeof VisualisationStateSchema>;
export type VisualisationInputType = InferInput<typeof VisualisationSchema>;
export type AnnotationType = InferInput<typeof AnnotationSchema>;
export type ArrowType = InferOutput<typeof ArrowSchema>;
export type HighlightType = InferOutput<typeof HighlightSchema>;
export type SeriesType = InferOutput<typeof SeriesSchema>;
export type DataSourceType = InferInput<typeof DataSourceSchema>;

export type SeriesLineType = InferOutput<typeof SeriesLineSchema>;
export type AxisConfigType = InferOutput<typeof AxisConfigSchema>;
export type AxisOptionsType = InferOutput<typeof AxisOptionsSchema>;
export type ColumnTypesType = InferOutput<typeof ColumnTypesSchema>;
export type ColumnDefinitionType = InferOutput<typeof ColumnDefinitionSchema>;
export type ChartPositionType = InferOutput<typeof ChartPositionSchema>;

export enum AnnotationAnchorType {
  Top = 'TOP',
  TopRight = 'TOP_RIGHT',
  Right = 'RIGHT',
  BottomRight = 'BOTTOM_RIGHT',
  Bottom = 'BOTTOM',
  BottomLeft = 'BOTTOM_LEFT',
  Left = 'LEFT',
  TopLeft = 'TOP_LEFT',
  Middle = 'MIDDLE'
}

export type LayerCakeGroupedDataType = LayerCakeGroupedDataGroupType[];
export type LayerCakeGroupedDataGroupType = {
  group: string;
  values: LayerCakeGroupedDataGroupValuesType[];
  config: SeriesType;
};
export type LayerCakeGroupedDataGroupValuesType = {
  x: string | number | boolean | Date | null | undefined;
  y: string | number | boolean | Date | null | undefined;
  z: string;
  row: Record<string, string | number | boolean | Date | null>;
};

export type PlotPadding = { top?: number; bottom?: number; left?: number; right?: number };

export type LayerCakeScalesTypes = {
  x: ScaleLinear<number | Date, number>;
  y: ScaleLinear<number | Date, number>;
};

// export type LayerCakeContextType = LayerCakeContext<LayerCakeScalesTypes, LayerCakeGroupedDataType>;

export type ColumnDataTypes = Date | number | string | boolean;
export type ColumnDataTypeMap = {
  date: Date;
  number: number;
  string: string;
  boolean: boolean;
};

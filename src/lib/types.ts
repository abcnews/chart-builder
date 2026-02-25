import type { InferInput, InferOutput } from 'valibot';
import type {
  AnnotationSchema,
  ArrowSchema,
  AxisConfigSchema,
  AxisOptionsSchema,
  ChartPositionSchema,
  ColumnDefinitionSchema,
  ColumnTypesSchema,
  DataRowSchema,
  DataSchema,
  DataSetSchema,
  DataSourceSchema,
  DeletableSchema,
  HighlightSchema,
  SeriesLineSchema,
  SeriesSchema,
  VisualisationSchema
} from './schemas';
import type { Readable } from 'svelte/store';

export type DataSetType = InferOutput<typeof DataSetSchema>;
export type DataSchemaType = InferOutput<typeof DataSchema>;
export type DataRowSchemaType = InferOutput<typeof DataRowSchema>;
export type DeletableType = InferOutput<typeof DeletableSchema>;
export type VisualisationType = InferOutput<typeof VisualisationSchema>;
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

export type CustomLayerCakeContextType = { showConstructionMarks: boolean };

export type LayerCakeGroupedDataType = LayerCakeGroupedDataGroupType[];
export type LayerCakeGroupedDataGroupType = { group: string; values: LayerCakeGroupedDataGroupValuesType[] };
export type LayerCakeGroupedDataGroupValuesType =
  | {
      x: string | number | boolean | Date | null | undefined;
      y: string | number | boolean | Date | null | undefined;
      series: string;
    }[]
  | undefined;

export type LayerCakeContextType = {
  xScale: Readable<(date: Date) => number>;
  yScale: Readable<(d: number) => number>;
  custom: Readable<CustomLayerCakeContextType>;
  data: Readable<LayerCakeGroupedDataType>;
  xGet: Readable<(d: LayerCakeGroupedDataGroupValuesType) => number>;
  yGet: Readable<(d: LayerCakeGroupedDataGroupValuesType) => number>;
  zGet: Readable<(d: LayerCakeGroupedDataGroupValuesType) => string>;
};

import { parse } from 'date-fns';
import {
  array,
  date,
  enum_,
  intersect,
  literal,
  nullable,
  number,
  object,
  optional,
  picklist,
  pipe,
  record,
  string,
  transform,
  tuple,
  union,
  url,
  variant
} from 'valibot';
import { AnnotationAnchorType } from './types';

export const DeletableSchema = object({
  deleted: optional(number())
});

export const orientations = ['left', 'right', 'above', 'below', 'middle'] as const;
export const shapes = ['circle', 'diamond', 'square'] as const;
export const columnTypes = ['number', 'date', 'boolean', 'string'] as const;

export const DataRowSchema = object({
  date: pipe(
    string(),
    transform(d => parse(d, 'LLL-yy', new Date()))
  ),
  excl: number(),
  incl: nullable(number())
});

export const DataSchema = array(DataRowSchema);

export const ShapesSchema = picklist(shapes);

export const AnnotationAnchorSchema = enum_(AnnotationAnchorType);

export const ColumnTypesSchema = picklist(columnTypes);

export const ColumnDefinitionSchema = record(string(), ColumnTypesSchema);

export const AxisPositionSchema = union([number(), string()]);

export const ChartPositionSchema = object({
  x: AxisPositionSchema,
  y: AxisPositionSchema
});

/**
 * This defines a generic dataset that can be used in the builder. Essentially it's just a name and a URL with some
 * additional options to configure how its interpreted.
 */
export const DataSetSchema = object({
  name: string(),
  url: string(),
  columns: optional(ColumnDefinitionSchema, {})
});

const ElementColourSchema = optional(string());

export const AnnotationSchema = intersect([
  object({
    label: string(),
    anchor: optional(AnnotationAnchorSchema, AnnotationAnchorType.Top),
    width: optional(number(), 10), // Width in em units
    colour: ElementColourSchema
  }),
  ChartPositionSchema
]);

export const ArrowSchema = object({
  from: ChartPositionSchema,
  to: ChartPositionSchema,
  colour: ElementColourSchema
});

export const HighlightSchema = object({
  tl: ChartPositionSchema,
  br: ChartPositionSchema,
  colour: ElementColourSchema
});

export const SeriesLineSchema = object({
  id: string(),
  type: literal('line'),
  dataset: optional(string()), // Name of the dataset
  x: optional(string()), // Field to be used for x value
  y: optional(string()), // Field to be used for y value
  colour: ElementColourSchema,
  dasharray: optional(string())
});

export const SeriesSchema = variant('type', [SeriesLineSchema]);

export const DataSourceSchema = object({
  label: string(),
  url: optional(string())
});

export const AxisOptionsSchema = object({
  format: optional(string()),
  ticks: optional(string()),
  domain: object({
    min: optional(nullable(AxisPositionSchema)),
    max: optional(nullable(AxisPositionSchema))
  })
});

export const AxisConfigSchema = object({
  x: AxisOptionsSchema,
  y: AxisOptionsSchema
});

/**
 * Over time, the goal is to move toward following the [Vega schema](https://vega.github.io/vega/docs/). It is a minumum viable
 * interpretation for this specific visualisation with the idea that it might be used as a starting point for expansion
 * in the future. The idea is to achieve a declarative JSON schema and sent of components that renders it into a visualisation.
 * Roughly following Vega because it's a sensible and fullsome declarative spec for data vis. It might be possible to
 * more fully adopt it at some point.
 */
export const VisualisationSchema = object({
  title: optional(string(), 'Chart title'),
  subtitle: optional(string()),
  description: optional(string()),
  annotations: optional(array(intersect([AnnotationSchema, DeletableSchema])), []),
  arrows: optional(array(intersect([ArrowSchema, DeletableSchema])), []),
  highlights: optional(array(intersect([HighlightSchema, DeletableSchema])), []),
  series: optional(array(intersect([SeriesSchema, DeletableSchema])), []),
  data: optional(array(intersect([DataSetSchema, DeletableSchema])), []),
  sources: optional(array(intersect([DataSourceSchema, DeletableSchema])), []),
  axes: optional(AxisConfigSchema, { x: { domain: {} }, y: { domain: {} } })
});

export const VisualisationStateSchema = object({
  config: VisualisationSchema
});

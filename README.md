# Charts

A chart builder and display components for standalone iframe embeds and scrollytelling.

The builder provides an authoring environment for generating base 36 encoded JSON configuration blobs that can be used
by the Visualisation component to display a chart. Updating the configuration string will dynamically update the chart.

The configuration object points to one or more CSV datasets which are fetched and parsed according to the options
defined in the configuration to display the charts.

# Development

This is an `aunty` project developed and deployed like any other. There are three entry points:

- `src/builder.ts` / `public/index.html` — The builder interface
- `src/iframe.ts` / `public/iframe/index.html` — A page that will load and display a visualisation base on a
  configuration string supplied as a fragment on the URL.
- `index.ts` — A scrollyteller script for use in an Odyssey project that can display and transition between visualisations.

## Schema

### Configuration

The configuration schema is described in [schemas.ts](./src/lib/schemas.ts).

The configuration object itself must be a plain object that can be successfully stringified and parsed as JSON. Anything
that needs to be derived from the object in order to be used in the visualisation or builder (like axis domain Date
objects, for example) should be derived state and not stored on the visualisation config object itself.

Because the state object is deeply nested and updates to state can happen via a whole new configuration object external
to the currently active state, updates must be applied granularly rather than replacing the state object entierly in
order to support things like animating between states and to avoid re-fetching already fetched data.

Many properties on the visualisation schema are optional. This provides two advantages:

- We can set sensible defaults and minimise the requirement to define things when authoring charts.
- It's easier for the system to remain compatible with older versions of the schema because the parsing done with valibot can use defaults to fill out any missing parts of the schema.

### Data

The datasets can be any CSV. Raw data is fetched from the supplied URL and stored as text in a state object on the
Visualisation component. Like the config schema, this should remain a plain object. The raw data string and the plain
configuration object should be all that's required for the Visualisation to render successfully.

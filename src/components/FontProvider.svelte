<script lang="ts">
  let { children } = $props();
  // TODO: replace this with TypographyProvider from components-storylab
</script>

<div>{@render children()}</div>

<style>
  @font-face {
    font-family: ABCSans;
    font-weight: 300;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-light.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-light.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 400;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-regular.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-regular.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 700;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-bold.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-bold.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 800;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-black.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-black.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 300;
    font-style: italic;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-lightitalic.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-lightitalic.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 400;
    font-style: italic;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-italic.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-italic.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 700;
    font-style: italic;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-bolditalic.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-bolditalic.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans;
    font-weight: 800;
    font-style: italic;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-blackitalic.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-blackitalic.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Condensed;
    font-weight: 300;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedlight.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedlight.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Condensed;
    font-weight: 400;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedbold.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedbold.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Condensed;
    font-weight: 700;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedbold.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedbold.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Condensed;
    font-weight: 800;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedbold.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20220713/abcsansnova-condensedbold.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Rounded;
    font-weight: 400;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-rounded.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-rounded.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Rounded;
    font-weight: 700;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-roundedbold.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsansnova/20211112/abcsansnova-roundedbold.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Tabbed;
    font-weight: 300;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-light-tabnumbers.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-light-tabnumbers.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Tabbed;
    font-weight: 400;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-regular-tabnumbers.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-regular-tabnumbers.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Tabbed;
    font-weight: 400;
    font-style: italic;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-regularitalic-tabnumbers.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-regularitalic-tabnumbers.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Tabbed;
    font-weight: 700;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-bold-tabnumbers.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-bold-tabnumbers.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSans Tabbed;
    font-weight: 800;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-black-tabnumbers.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcsans/abcsans-black-tabnumbers.woff) format('woff');
    font-display: swap;
  }
  @font-face {
    font-family: ABCSerif;
    font-weight: 400;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcserif/abcserif-regular.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcserif/abcserif-regular.woff) format('woff');
  }
  @font-face {
    font-family: ABCSerif;
    font-weight: 400;
    font-style: italic;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcserif/abcserif-regular_italic.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcserif/abcserif-regular_italic.woff) format('woff');
  }
  @font-face {
    font-family: ABCSerif;
    font-weight: 700;
    font-style: normal;
    src:
      url(https://static.abc-cdn.net.au/fonts/abcserif/abcserif-bold.woff2) format('woff2'),
      url(https://static.abc-cdn.net.au/fonts/abcserif/abcserif-bold.woff) format('woff');
  }

  div {
    display: contents;
    --sl-font-stack-condensed: 'abcsans condensed', -apple-system, blinkmacsystemfont, 'Segoe UI', 'Roboto',
      'Helvetica Neue', arial, sans-serif;
    --sl-font-stack-rounded: 'abcsans rounded', -apple-system, blinkmacsystemfont, 'Segoe UI', 'Roboto',
      'Helvetica Neue', arial, sans-serif;
    --sl-font-stack-sans: 'abcsans', -apple-system, blinkmacsystemfont, 'Segoe UI', 'Roboto', 'Helvetica Neue', arial,
      sans-serif;
    --sl-font-stack-serif: 'abcserif', 'Book Anitqua', 'Palatino Linotype', palatino, serif;
    --sl-font-stack-monospace: 'abcsans tabbed', monospace;

    font-family: var(--sl-font-stack-sans);
  }
</style>

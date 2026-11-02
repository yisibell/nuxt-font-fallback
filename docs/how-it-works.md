# Font Loading and Layout Shift: Problem and Solution

[简体中文](./how-it-works.zh.md)

## The problem: font switches can move page content

When a page opens, its brand font may need to download. Until it is ready, the browser displays text using a font already on the device: the **fallback font**.

Fonts can have different widths and line heights even at the same font size. For example, a group of product tags might take three rows in the fallback font and two rows in the brand font. When the switch occurs, the content below moves. This visible movement affects the user experience and can contribute to **CLS (Cumulative Layout Shift)**.

## Why tag layouts can cause noticeable CLS

Product categories and filter tags often flow horizontally and wrap when there is not enough space. **Wrapping has a threshold**: a few extra pixels can push an entire tag onto the next row, and later tags can move with it. If the number of rows changes, content below the tag area moves too.

For example, a row may be `600px` wide. The tags might occupy `598px` in the brand font but `605px` in the fallback. Although the difference is only `7px`, the last tag wraps in the fallback. When the brand font loads, the tag moves back and the content below moves up, creating a visible layout shift. Actual **CLS** depends on the visible area affected and the distance moved, so text-width error alone cannot determine a **CLS** score.

## The solution: adjust the fallback font

The module calculates fallback adjustments during the site build. While the brand font loads, the browser can use the adjusted fallback to bring text width and line height closer to the final layout. Users do not need to calculate settings for every piece of text; the application remains responsible for loading the brand font itself.

This reduces the risk of layout changes, but cannot guarantee identical widths or zero **CLS**. Check results against real page content, devices, and fonts.

**Use the module in a tag layout:**

1. Configure the target font file and fallback families that may be available on user devices. The module generates adjusted fallback faces.
2. In the tag style's `font-family`, put the target font first and the generated fallback family after it. The browser can then use the adjusted fallback while the target font is unavailable.
3. If the standard fallback still has substantial width error for the tags, enable **Balanced** and configure one or more `balancedWidthWeight` values. Choose a generated family that works better for the actual tags; each tag does not need its own calculation.
4. Check row counts, tag positions, and movement of content below before and after the font loads, using real tag text, common viewport widths, and target devices. Measure actual CLS with performance tools.

For example, with `balancedWidthWeight: [0.27, 0.9]`, a tag style can use the first variant:

```css
.tag {
  font-family: 'Gotham', 'GothamOverrideBalanced1', sans-serif;
  white-space: nowrap;
}
```

Here `white-space: nowrap` keeps the text inside an individual tag on one line; the tags themselves can still wrap. The `0.27` weight is only an example: it might suit one set of uppercase labels while making other text narrower. The module reduces differences but cannot guarantee that arbitrary text will never cross a wrapping threshold. Reserving appropriate space for the tag area can also reduce movement of subsequent content when the row count changes.

## Validating with the tag demo

The [Playground home page](https://nuxt-font-fallback.vercel.app/)'s **Uppercase text preview** provides a useful test case. It shows the same product-category tags in mixed case and uppercase, and the tags wrap as the container width changes. The two groups help reveal how the same fallback behaves with different text.

Under the same browser, viewport width, device, and network conditions, compare an unadjusted fallback, a module-generated fallback, and the final loaded font:

1. Throttle the network and disable the cache in developer tools. Reload and observe the rows and tag positions before and after the target font loads.
2. Toggle **Metric Override** and compare whether tags reflow and whether content below the tag area moves during the font switch.
3. Try several common viewport widths, particularly widths near a wrapping threshold. Inspect both mixed-case and uppercase groups.
4. Record actual **CLS** with browser performance tools, noting the device, viewport, network conditions, fonts, and module settings. Repeat the measurements before comparing results.

**Mixed-case text**

| Viewport width | Observation | Unadjusted fallback | Module-generated fallback |
|---|---|---|---|
| `870px` | Tag row counts before and after the switch | `3 to 4 rows` | `Unchanged` |
| `870px` | Movement of tags and content below | `Yes` | `No` |
| `870px` | Actual page **CLS** | `0.38` | `0.00` |

**Uppercase text**

| Viewport width | Observation | Unadjusted fallback | Module-generated fallback |
|---|---|---|---|
| `715px` | Tag row counts before and after the switch | `Unchanged` | `Unchanged` |
| `715px` | Movement of tags and content below | `Yes` | `No` |
| `715px` | Actual page **CLS** | `0.24` | `0.00` |

**CLS** is a page-wide metric. Each row records page **CLS** for that test scenario, not a value attributable entirely to that text group. Inspect individual shifts in the performance tools.

The home page's **Metric Override** toggle controls both the standard fallback and the **Balanced** fallbacks used by the tag demo. When disabled, the tags use the browser's `sans-serif` fallback while the target font is unavailable. Base tags use `Balanced2` and uppercase tags use `Balanced1`; the toggle does not switch between these weights. The home page also contains other content, so page-level **CLS** may include shifts from other elements; inspect individual layout-shift records to identify their causes. Results reflect the measured scenarios and may differ under other test conditions.

## Implementation: font metric descriptors

The module generates four CSS settings for each fallback. One adjusts the text size; the other three adjust the space the browser uses above, below, and between lines of text.

| Descriptor | Purpose |
|---|---|
| `size-adjust` | Makes the fallback font larger or smaller. Character widths change too, affecting how much text fits on a line. |
| `ascent-override` | Adjusts layout space above the baseline, the reference line along which most letters sit. |
| `descent-override` | Adjusts layout space below the baseline, including space for the lower parts of letters such as `g` and `p`. |
| `line-gap-override` | Adjusts the font's additional line-gap metric to help match spacing between lines. |

The three vertical overrides control font metrics rather than resizing or clipping glyph outlines. Their interaction with line layout depends on the element's `line-height` and other fonts in the line. The vertical override percentages are relative to the font's adjusted em size, so changing `size-adjust` also requires recalculating them when matching the same target metrics.

## From configuration to CSS

1. Each `fonts` entry identifies a web font file relative to Nuxt's `srcDir` and a family name for its fallback. The application must define and load the web font separately.
2. [Fontaine](https://github.com/unjs/fontaine) reads the web font's metrics. For each configured `fallbackFonts` family, **Fontaine** looks up local-font metrics from its [Capsize](https://github.com/seek-oss/capsize) collection.
3. The module generates a separate `@font-face` for each available fallback family, using `local(...)` sources and that family's own overrides. It emits faces in reverse configuration order so the first configured family has priority among matching available faces.
4. Nuxt writes the generated CSS templates into its build directory and injects them into the global CSS list. The application's `font-family` must explicitly reference the desired generated family after the web font.

## Standard fallback

The standard option primarily matches the fonts' **average character widths** so that text has a similar overall width. It is enabled by default, but matching an average does not make every word equally wide.

For technical readers, **Fontaine** uses this ratio when both fonts have usable average widths:

```text
widthScale = (target.xWidthAvg / target.unitsPerEm)
           / (fallback.xWidthAvg / fallback.unitsPerEm)
```

`size-adjust` scales the local font's glyphs and metrics. **Fontaine** also derives `ascent-override`, `descent-override`, and `line-gap-override` from the target's vertical metrics and the scale. These descriptors influence font metrics and line layout; they do not change individual glyph outlines into those of the target font.

`normalFallback` controls this output and defaults to `true`. For example, a configured name `GothamOverride` produces faces with that family name in `nuxt-font-fallback.css` by default.

## Balanced fallback

Balanced is an optional alternative that considers both text width and visual height. **X-height** is a way to describe the height of the main body of lowercase letters, such as `x`.

These goals can compete: matching width more closely may make the fallback look larger, while matching visual height may make some text narrower. Balanced uses a weight to choose a compromise; it is not guaranteed to be better for every situation.

When `balancedFallback` is enabled, the module reads the target font's full metrics using Capsize and looks up the fallback's x-height in the Capsize collection. For technical readers, it combines the normalized ratios as follows:

```text
heightScale = (target.xHeight / target.unitsPerEm)
            / (fallback.xHeight / fallback.unitsPerEm)
scale = widthScale * weight + heightScale * (1 - weight)
```

`balancedWidthWeight` is between 0 and 1 and defaults to `0.82`. A higher value favors **average width**; a lower value favors **x-height**. The selected scale is passed through **Fontaine**'s generator, which also computes the corresponding vertical overrides. At weight `1` the scale normally matches the standard path, but balanced generation still requires usable **x-height** data.

A single weight produces an unnumbered family such as `GothamOverrideBalanced` and `nuxt-font-fallback.balanced.css`. An array such as `[0.27, 0.9]` produces numbered families (`GothamOverrideBalanced1`, `GothamOverrideBalanced2`) and files (`nuxt-font-fallback.balanced-1.css`, `nuxt-font-fallback.balanced-2.css`) in array order. Set `normalFallback: false` to generate only balanced faces. An empty weight array generates no balanced files.

## Missing data and practical limits

Unavailable fallback metrics are reported as `SKIP` comments in generated CSS; balanced faces also require usable **x-height** and **average-width** data. An unreadable target font produces a `FAIL` comment for that entry. If the user's device has none of the generated local faces, the browser continues to the next family in the application's font stack.

Average width is a font-level estimate, not the width of every string. Uppercase labels, body text and different languages can produce different errors, and small width differences can change wrapping near a boundary. Test actual content and devices; a weight tuned for one font pair or text sample is not universally optimal. Explicit line-height affects the resulting line box as well.

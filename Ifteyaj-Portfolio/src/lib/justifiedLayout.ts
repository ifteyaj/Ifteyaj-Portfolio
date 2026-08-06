/**
 * Justified layout (Flickr-style) packing algorithm.
 *
 * Items of mixed aspect ratio (landscape / portrait / square) are grouped
 * greedily into rows. Each row is given a height derived from the sum of its
 * items' aspect ratios so that the total row width exactly equals the
 * container width — leaving zero gaps between images and between rows. Images
 * are cropped via `object-fit: cover` to fill perfectly-packed cells.
 *
 * Reference approach: Flickr's "justified layout"
 * (https://github.com/flickr/justified-layout).
 */

export interface JustifiedPanel<Item = unknown> {
  /** original payload (image, title, etc.) */
  item: Item;
  /** width / height (source aspect ratio) */
  aspect: number;
  /** stable unique key */
  key: string;
  /** px — this panel's share of the row width */
  width: number;
  /** px — same as the row height */
  height: number;
}

export interface JustifiedRow<Item = unknown> {
  panels: JustifiedPanel<Item>[];
  height: number;
}

export interface JustifiedInput<Item = unknown> {
  item: Item;
  aspect: number;
  key: string;
}

export interface JustifiedResult<Item = unknown> {
  rows: JustifiedRow<Item>[];
  containerHeight: number;
}

export interface JustifiedOpts {
  containerWidth: number;
  targetRowHeight: number;
  maxRowHeight?: number;
}

/**
 * Greedy justified pack. `aspect` = width/height.
 * Row height = containerWidth / Σ(aspect). Because a row's panels tile by
 * aspect, the row exactly fills the container width with no gaps (visualized as
 * `flex-grow: aspect`). `object-fit: cover` crops each panel to fit its cell.
 */
export function justifiedLayout<Item>(
  panels: JustifiedInput<Item>[],
  opts: JustifiedOpts
): JustifiedResult<Item> {
  const { containerWidth, targetRowHeight } = opts;
  const maxRowHeight = opts.maxRowHeight ?? containerWidth;

  const rows: JustifiedRow<Item>[] = [];

  let i = 0;
  while (i < panels.length) {
    let sumAspect = 0;
    const rowPanels: JustifiedPanel<Item>[] = [];

    // Fill a row greedily.
    for (;;) {
      if (i >= panels.length) break;
      const panel = panels[i];
      const wouldFill = (sumAspect + panel.aspect) * targetRowHeight;
      // Start a new row if adding this would overflow AND the row already has
      // at least one panel.
      if (rowPanels.length && wouldFill > containerWidth) break;
      rowPanels.push({
        item: panel.item,
        aspect: panel.aspect,
        key: panel.key,
        width: 0,
        height: 0,
      });
      sumAspect += panel.aspect;
      i += 1;
      // Stop once the row reaches the container width (rest → next row).
      if (sumAspect * targetRowHeight >= containerWidth) break;
    }

    if (!rowPanels.length) break;

    // Row height makes total width land exactly on the container width.
    let height = containerWidth / sumAspect;
    if (height > maxRowHeight) height = maxRowHeight;

    for (const p of rowPanels) {
      p.width = p.aspect * height;
      p.height = height;
    }

    rows.push({ panels: rowPanels, height });
  }

  let containerHeight = 0;
  for (const r of rows) containerHeight += r.height;

  return { rows, containerHeight };
}
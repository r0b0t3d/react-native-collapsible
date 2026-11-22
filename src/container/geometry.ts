export type HeaderLayout = {
  y: number;
  height: number;
  stickyHeight: number;
};

export type HeaderLayouts = Record<string, HeaderLayout>;

export type StackPosition = {
  index: number;
  top: number;
};

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(value, max));
}

export function headerHeightOf(layouts: HeaderLayouts) {
  'worklet';
  let height = 0;
  for (const key in layouts) {
    const layout = layouts[key]!;
    height = Math.max(height, layout.y + layout.height);
  }
  return height;
}

export function collapsibleDistanceOf(layouts: HeaderLayouts) {
  'worklet';
  let stickyHeight = 0;
  for (const key in layouts) {
    stickyHeight += layouts[key]!.stickyHeight;
  }
  return Math.max(0, headerHeightOf(layouts) - stickyHeight);
}

export function stickyHeightAbove(layouts: HeaderLayouts, y: number) {
  'worklet';
  let stickyHeight = 0;
  for (const key in layouts) {
    const layout = layouts[key]!;
    if (layout.y + layout.height < y) {
      stickyHeight += layout.stickyHeight;
    }
  }
  return stickyHeight;
}

export function stackPosition(
  layouts: HeaderLayouts,
  key: string
): StackPosition | undefined {
  'worklet';
  const own = layouts[key];
  if (!own) {
    return undefined;
  }
  let index = 0;
  let top = 0;
  for (const otherKey in layouts) {
    const other = layouts[otherKey]!;
    if (otherKey !== key && other.y < own.y) {
      index += 1;
      top += other.stickyHeight;
    }
  }
  return { index, top };
}

export function headerTranslate(
  layout: HeaderLayout,
  stackTop: number,
  scrollY: number
) {
  'worklet';
  const maxTranslate = Math.max(
    0,
    layout.y + layout.height - stackTop - layout.stickyHeight
  );
  return -clamp(scrollY, 0, maxTranslate);
}

export function headerScroll(
  layout: HeaderLayout,
  stackTop: number,
  scrollY: number
) {
  'worklet';
  return clamp(
    scrollY - layout.y + stackTop,
    0,
    layout.height - layout.stickyHeight
  );
}

export function stickyTranslate(scrolled: number, stickyY: number) {
  'worklet';
  return Math.max(0, scrolled - stickyY);
}

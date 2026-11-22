import {
  collapsibleDistanceOf,
  headerHeightOf,
  HeaderLayouts,
  headerScroll,
  headerTranslate,
  stackPosition,
  stickyHeightAbove,
  stickyTranslate,
} from '../geometry';

const parent = { y: 0, height: 300, stickyHeight: 50 };
const tab = { y: 300, height: 120, stickyHeight: 40 };
const layouts: HeaderLayouts = { tab, parent };

describe('header stack', () => {
  it('measures the header from the bottom of the lowest header', () => {
    expect(headerHeightOf(layouts)).toBe(420);
    expect(headerHeightOf({})).toBe(0);
  });

  it('collapses the header down to the sum of sticky heights', () => {
    expect(collapsibleDistanceOf(layouts)).toBe(330);
    expect(
      collapsibleDistanceOf({ a: { y: 0, height: 20, stickyHeight: 40 } })
    ).toBe(0);
  });

  it('orders headers by position and stacks sticky heights above each one', () => {
    expect(stackPosition(layouts, 'parent')).toEqual({ index: 0, top: 0 });
    expect(stackPosition(layouts, 'tab')).toEqual({ index: 1, top: 50 });
    expect(stackPosition(layouts, 'missing')).toBeUndefined();
  });

  it('updates the stack when a header is removed', () => {
    const withoutParent: HeaderLayouts = { tab };
    expect(stackPosition(withoutParent, 'tab')).toEqual({ index: 0, top: 0 });
    expect(collapsibleDistanceOf(withoutParent)).toBe(380);
  });

  it('counts sticky heights of headers that end above a point', () => {
    expect(stickyHeightAbove(layouts, 100)).toBe(0);
    expect(stickyHeightAbove(layouts, 301)).toBe(50);
    expect(stickyHeightAbove(layouts, 500)).toBe(90);
  });
});

describe('header motion', () => {
  it('moves a header up with the scroll until its sticky part reaches the stack', () => {
    expect(headerTranslate(parent, 0, -20)).toBeCloseTo(0);
    expect(headerTranslate(parent, 0, 100)).toBe(-100);
    expect(headerTranslate(parent, 0, 1000)).toBe(-250);
    expect(headerTranslate(tab, 50, 1000)).toBe(-330);
  });

  it('reports how far the scroll has passed into a header', () => {
    expect(headerScroll(tab, 50, 0)).toBe(0);
    expect(headerScroll(tab, 50, 290)).toBe(40);
    expect(headerScroll(tab, 50, 1000)).toBe(80);
  });

  it('pins a sticky view once the scroll passes its position', () => {
    expect(stickyTranslate(100, 250)).toBe(0);
    expect(stickyTranslate(260, 250)).toBe(10);
  });
});

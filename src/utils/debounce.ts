// https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
export function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    // @ts-ignore
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

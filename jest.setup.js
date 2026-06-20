// Minimal mock for react-native-reanimated in tests.
// We can't use the official mock (it references a path that isn't compiled
// in this RN/Reanimated combination), so we provide just enough surface
// for the library to import without exploding. All values are no-ops that
// satisfy the types.

const { View, Text, Image, ScrollView } = require('react-native');

const NOOP = () => {};
const ID = (t) => t;

function makeSharedValue(initial) {
  return { value: initial };
}

const Reanimated = {
  __esModule: true,
  default: {
    View,
    Text,
    Image,
    ScrollView,
    createAnimatedComponent: (C) => C,
  },
  View,
  Text,
  Image,
  ScrollView,
  createAnimatedComponent: (C) => C,
  useSharedValue: makeSharedValue,
  useDerivedValue: (fn) => ({ value: fn() }),
  useAnimatedStyle: (fn) => fn(),
  useAnimatedReaction: NOOP,
  useAnimatedScrollHandler: () => NOOP,
  useAnimatedProps: (fn) => fn(),
  withTiming: (v) => v,
  withSpring: (v) => v,
  withDecay: (v) => v,
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn(),
  interpolate: (v, _a, b) => b[0] || 0,
  interpolateColor: () => 'rgba(0,0,0,1)',
  Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  Easing: {
    linear: ID,
    ease: ID,
    inOut: () => ID,
    out: () => ID,
    in: () => ID,
  },
  SharedValue: function () {},
};

module.exports = Reanimated;
module.exports.default = Reanimated;

import { Dimensions, PixelRatio } from 'react-native';


var WINDOW_WIDTH = Dimensions.get('screen').width;
var WINDOW_HEIGHT = Dimensions.get('screen').height;
// For Mobile Devices
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;


if (WINDOW_HEIGHT < WINDOW_WIDTH ) {
  WINDOW_WIDTH = Dimensions.get('screen').height;
  WINDOW_HEIGHT = Dimensions.get('screen').width;
}

const scale = 
     WINDOW_WIDTH / guidelineBaseWidth;

const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};

const normalize = memoize((size) => {
  const scaledWidth =
       Math.floor((WINDOW_WIDTH / guidelineBaseWidth) * size);
  return scaledWidth < 1 ? 1 : scaledWidth;
});

const normalizeHeight = memoize((size) => {
  const scaledHeight =  Math.floor((WINDOW_HEIGHT / guidelineBaseHeight) * size);
  return scaledHeight < 1 ? 1 : scaledHeight;
});

const normalizeFont = memoize((size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize) - 2);
});

const normalizeWidth = memoize((size) => {
  const scaledWidth =  Math.floor((WINDOW_WIDTH / guidelineBaseWidth) * size);
  return scaledWidth < 1 ? 1 : scaledWidth;
});

export {
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  normalize,
  normalizeHeight,
  normalizeFont,
  normalizeWidth,
};

// src/utils/strokeAnalysis.js

export const calculateStrokeMetrics = (strokes) => {
  const metrics = {
    totalStrokes: strokes.length,
    averageStrokeLength: 0,
    strokeDensity: 0,
    bounds: calculateBounds(strokes),
  };

  let totalLength = 0;
  strokes.forEach((stroke) => {
    totalLength += calculateStrokeLength(stroke);
  });

  metrics.averageStrokeLength = totalLength / metrics.totalStrokes;
  metrics.strokeDensity =
    totalLength / (metrics.bounds.width * metrics.bounds.height);

  return metrics;
};

export const calculateStrokeLength = (stroke) => {
  let length = 0;
  for (let i = 1; i < stroke.length; i++) {
    const dx = stroke[i][0] - stroke[i - 1][0];
    const dy = stroke[i][1] - stroke[i - 1][1];
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
};

export const calculateBounds = (strokes) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  strokes.forEach((stroke) => {
    stroke.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
};

export const compareWithIdeal = (userMetrics, idealMetrics) => {
  const comparison: {
    size: number;
    proportion: number;
    strokeCount: number;
    density: number;
    totalScore?: number;
  } = {
    size: calculateSizeDifference(userMetrics, idealMetrics),
    proportion: calculateProportionDifference(userMetrics, idealMetrics),
    strokeCount: Math.abs(userMetrics.totalStrokes - idealMetrics.totalStrokes),
    density: Math.abs(userMetrics.strokeDensity - idealMetrics.strokeDensity),
  };

  comparison.totalScore = calculateTotalScore(comparison);
  return comparison;
};

const calculateSizeDifference = (user, ideal) => {
  const userArea = user.bounds.width * user.bounds.height;
  const idealArea = ideal.bounds.width * ideal.bounds.height;
  return Math.abs(1 - userArea / idealArea);
};

const calculateProportionDifference = (user, ideal) => {
  const userRatio = user.bounds.width / user.bounds.height;
  const idealRatio = ideal.bounds.width / ideal.bounds.height;
  return Math.abs(1 - userRatio / idealRatio);
};

const calculateTotalScore = (comparison) => {
  const weights = {
    size: 0.25,
    proportion: 0.35,
    strokeCount: 0.2,
    density: 0.2,
  };

  let score = 100;
  score -= comparison.size * 100 * weights.size;
  score -= comparison.proportion * 100 * weights.proportion;
  score -= (comparison.strokeCount / 2) * 100 * weights.strokeCount;
  score -= comparison.density * 100 * weights.density;

  return Math.max(0, Math.min(100, score));
};

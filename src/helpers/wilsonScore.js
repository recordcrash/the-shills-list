export default class WilsonScore {
    static lowerBound(k, n, confidence = 0.95) {
      if (n === 0) return 0
      const z = 1.96 // Z-score for 95% confidence
      const phat = k / n
      const denominator = 1 + (z * z) / n
      const numerator = phat + (z * z) / (2 * n) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)
      return numerator / denominator
    }
  }
  
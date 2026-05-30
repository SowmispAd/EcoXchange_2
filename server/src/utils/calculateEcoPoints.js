const POINTS_PER_KG = {
  plastic: 10,
  paper: 5,
  metal: 15,
  glass: 8,
  organic: 4,
  ewaste: 20,
};

const calculateEcoPoints = (wasteType, weight) => {
  const pointsPerKg = POINTS_PER_KG[wasteType];
  const safeWeight = Number(weight);

  if (!pointsPerKg || !Number.isFinite(safeWeight) || safeWeight < 0) {
    return 0;
  }

  return pointsPerKg * safeWeight;
};

module.exports = { calculateEcoPoints };

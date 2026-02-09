
import { CalculatorState, CalculationResults } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateMargins = (state: CalculatorState): CalculationResults => {
  const { 
    foreignCost, exchangeRate, shippingCost, shippingMode, 
    taxRate, targetMargin, manualRetailPrice 
  } = state;

  const baseCostTwd = foreignCost * exchangeRate;
  const shippingAmount = shippingMode === 'amount' 
    ? shippingCost 
    : baseCostTwd * (shippingCost / 100);
  
  // Logic follows standard retail landing: Tax applied to base + ship
  const taxAmount = (baseCostTwd + shippingAmount) * (taxRate / 100);
  const landedCost = baseCostTwd + shippingAmount + taxAmount;

  let suggestedRetailPrice = 0;
  let suggestedProfit = 0;
  let isValidMargin = targetMargin < 100;

  if (isValidMargin && landedCost > 0) {
    suggestedRetailPrice = landedCost / (1 - (targetMargin / 100));
    suggestedProfit = suggestedRetailPrice - landedCost;
  }

  const isManualMode = manualRetailPrice > 0;
  const effectivePrice = isManualMode ? manualRetailPrice : suggestedRetailPrice;
  const manualMargin = effectivePrice > 0 
    ? ((effectivePrice - landedCost) / effectivePrice) * 100 
    : 0;

  return {
    baseCostTwd,
    shippingAmount,
    taxAmount,
    landedCost,
    suggestedRetailPrice,
    suggestedProfit,
    isValidMargin,
    effectivePrice,
    isManualMode,
    manualMargin
  };
};

export const getMarginColorClass = (margin: number) => {
  if (margin < 0) return 'text-red-500';
  if (margin < 15) return 'text-orange-400';
  if (margin < 30) return 'text-yellow-400';
  return 'text-brand-accent';
};

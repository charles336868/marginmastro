
export type ShippingMode = 'amount' | 'percent';

export interface CalculatorState {
  foreignCost: number;
  exchangeRate: number;
  shippingCost: number;
  shippingMode: ShippingMode;
  taxRate: number;
  targetMargin: number;
  manualRetailPrice: number;
}

export interface CalculationResults {
  baseCostTwd: number;
  shippingAmount: number;
  taxAmount: number;
  landedCost: number;
  suggestedRetailPrice: number;
  suggestedProfit: number;
  isValidMargin: boolean;
  effectivePrice: number;
  isManualMode: boolean;
  manualMargin: number;
}

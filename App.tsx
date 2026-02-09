import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorState, ShippingMode } from './types';
import { calculateMargins, formatCurrency, getMarginColorClass } from './utils';

const App: React.FC = () => {
  // Initialize state from local storage or defaults
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = localStorage.getItem('margin_maestro_config');
    if (saved) return JSON.parse(saved);
    return {
      foreignCost: 0,
      exchangeRate: 4.5,
      shippingCost: 30,
      shippingMode: 'amount',
      taxRate: 5,
      targetMargin: 70,
      manualRetailPrice: 0
    };
  });

  // Persist config
  useEffect(() => {
    localStorage.setItem('margin_maestro_config', JSON.stringify(state));
  }, [state]);

  const results = useMemo(() => calculateMargins(state), [state]);

  const handleInputChange = (key: keyof CalculatorState, value: string | number) => {
    setState(prev => ({
      ...prev,
      [key]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const handleReset = () => {
    if (window.confirm("確定要重設所有參數嗎？")) {
      setState({
        foreignCost: 0,
        exchangeRate: 4.5,
        shippingCost: 30,
        shippingMode: 'amount',
        taxRate: 5,
        targetMargin: 70,
        manualRetailPrice: 0
      });
    }
  };

  const scenarios = [
    { label: '-30%', rate: 0.7, color: 'bg-brand-accent' },
    { label: '-50%', rate: 0.5, color: 'bg-white' },
    { label: '-70%', rate: 0.3, color: 'bg-red-600' }
  ];

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4 flex items-center justify-center relative overflow-hidden bg-brand-concrete">
      {/* Watermark Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] pointer-events-none select-none z-0">
        <h1 className="text-[25vw] font-black text-black/5 leading-none tracking-tighter uppercase whitespace-nowrap">MAESTRO</h1>
      </div>

      {/* Industrial Markers - Hidden on mobile to save space */}
      <div className="hidden sm:block fixed top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-black pointer-events-none"></div>
      <div className="hidden sm:block fixed top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-black pointer-events-none"></div>
      <div className="hidden sm:block fixed bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-black pointer-events-none"></div>
      <div className="hidden sm:block fixed bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-black pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white border-4 border-black shadow-hard relative z-10 transition-all mx-auto">
        
        {/* Header Section */}
        <header className="bg-black text-white p-5 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black gap-6">
          <div className="space-y-2 w-full md:w-auto">
            {/* Fluid typography for header to prevent wrapping issues on mobile */}
            <h1 className="text-[11vw] sm:text-7xl font-black tracking-tighter uppercase leading-none">
              Margin<br/><span className="text-brand-accent">Maestro.</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-brand-accent text-black text-xs font-bold px-2 py-0.5">PRO EDITION</span>
              <span className="text-[10px] font-mono text-gray-500">SYS_V2.0_RESPONSIVE</span>
            </div>
          </div>
          <div className="text-left md:text-right flex flex-col md:items-end gap-1 w-full md:w-auto">
             <div className="inline-block self-start md:self-end border border-brand-accent text-brand-accent px-3 py-1 text-xs font-bold tracking-widest uppercase">
               一鍵定價系統
             </div>
             <p className="text-sm font-bold tracking-widest text-gray-400">掌握精準定價的藝術</p>
             <button 
                onClick={handleReset}
                className="mt-2 text-[10px] font-bold text-gray-500 hover:text-white underline uppercase tracking-widest transition-colors self-start md:self-end"
             >
               Reset Parameters
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-7 p-5 sm:p-10 space-y-6 sm:space-y-8 bg-gray-50 border-r-2 border-black/10 lg:border-r-0">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-6 h-6 bg-black flex items-center justify-center">
                 <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
               </div>
               <h2 className="text-xl font-black uppercase tracking-tight">Configuration 設定</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Cost Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Base Cost / 原幣成本</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-black/30 group-focus-within:text-black transition-colors">$</span>
                  <input 
                    type="number" 
                    value={state.foreignCost || ''} 
                    onChange={(e) => handleInputChange('foreignCost', e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white border-2 border-black p-3 sm:p-4 pl-10 text-right font-mono text-xl sm:text-2xl font-bold focus:bg-brand-accent/5 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                  />
                </div>
              </div>

              {/* Rate Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Exchange Rate / 匯率</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-black/30 group-focus-within:text-black transition-colors">CNY</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={state.exchangeRate || ''} 
                    onChange={(e) => handleInputChange('exchangeRate', e.target.value)}
                    className="w-full bg-white border-2 border-black p-3 sm:p-4 pl-14 text-right font-mono text-xl sm:text-2xl font-bold focus:bg-brand-accent/5 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Box */}
            <div className="bg-white border-2 border-black p-4 sm:p-6 space-y-4 shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] hover:shadow-hard transition-all">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Shipping / 國際運費</label>
                 <div className="flex w-full sm:w-auto bg-gray-100 p-1 border-2 border-black">
                    {(['amount', 'percent'] as ShippingMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setState(prev => ({ ...prev, shippingMode: mode }))}
                        className={`flex-1 sm:flex-none px-2 sm:px-4 py-1 text-[10px] font-bold uppercase transition-all ${
                          state.shippingMode === mode ? 'bg-black text-brand-accent' : 'text-gray-400 hover:text-black'
                        }`}
                      >
                        {mode === 'amount' ? 'Fixed NT$' : 'Rate %'}
                      </button>
                    ))}
                 </div>
               </div>
               <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-black/20 text-sm sm:text-base">
                    {state.shippingMode === 'amount' ? 'NT$' : 'RATIO'}
                  </span>
                  <input 
                    type="number" 
                    value={state.shippingCost || ''} 
                    onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                    // Updated padding: increased pl for 'RATIO', added pr to avoid % overlap
                    className="w-full bg-transparent border-b-4 border-black/10 focus:border-black p-3 sm:p-4 pl-16 sm:pl-20 pr-10 sm:pr-12 text-right font-mono text-2xl sm:text-3xl font-black transition-all outline-none"
                  />
                  {state.shippingMode === 'percent' && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-black text-black/20">%</span>}
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Tax */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Local Tax % / 稅率</label>
                <input 
                  type="number" 
                  value={state.taxRate || ''} 
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="w-full bg-white border-2 border-black p-3 sm:p-4 text-right font-mono text-xl sm:text-2xl font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                />
              </div>

              {/* Target Margin */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Target Margin / 目標毛利</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={state.targetMargin || ''} 
                    onChange={(e) => handleInputChange('targetMargin', e.target.value)}
                    // Updated padding: added pr to avoid % overlap
                    className="w-full bg-brand-accent border-2 border-black p-3 sm:p-4 pr-10 sm:pr-12 text-right font-mono text-xl sm:text-2xl font-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-black text-black/30 pointer-events-none">%</span>
                </div>
                {!results.isValidMargin && (
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter">! Error: Margin must be &lt; 100%</p>
                )}
              </div>
            </div>

            {/* Aesthetic Footer */}
            <div className="pt-6 sm:pt-8 flex justify-between items-end border-t-2 border-black/5">
               <div className="font-barcode text-3xl sm:text-5xl opacity-40 select-none">MARGIN-MAESTRO</div>
               <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest text-right">
                 Made by Vibe
               </div>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-5 bg-black text-white p-5 sm:p-10 flex flex-col justify-between border-t-4 lg:border-t-0 lg:border-l-4 border-black relative">
            {/* Grain/Noise Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }}></div>

            <div className="relative z-10 space-y-8 sm:space-y-10">
              {/* Landing Cost Summary */}
              <div>
                <span className="bg-brand-accent text-black text-[10px] font-black px-2 py-0.5 uppercase mb-4 inline-block">Cost Summary</span>
                <div className="text-[10px] font-mono text-gray-500 mb-1 tracking-widest">TOTAL LANDED COST (TWD)</div>
                <div className="text-4xl sm:text-5xl font-mono font-black text-brand-accent tracking-tighter">
                  {formatCurrency(results.landedCost)}
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-gray-800 pt-4 text-[10px] font-mono">
                  <div className="space-y-1">
                    <div className="text-gray-500 uppercase">Base</div>
                    <div className="text-white font-bold">{formatCurrency(results.baseCostTwd)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500 uppercase">Ship</div>
                    <div className="text-white font-bold">{formatCurrency(results.shippingAmount)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500 uppercase">Tax</div>
                    <div className="text-white font-bold">{formatCurrency(results.taxAmount)}</div>
                  </div>
                </div>
              </div>

              {/* Suggested Price Display */}
              <div className="bg-gray-900 border border-gray-700 p-4 sm:p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-brand-accent text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Suggested</div>
                
                <div className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Retail Price (建議售價)</div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white group-hover:text-brand-accent transition-colors leading-none break-all sm:break-normal">
                  {results.isValidMargin ? formatCurrency(results.suggestedRetailPrice) : 'ERROR'}
                </div>
                
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-800 text-[10px] font-mono">
                   <div className="space-y-1">
                     <span className="text-gray-500 uppercase">Est. Profit</span>
                     <div className="text-white font-bold text-sm">
                       {results.isValidMargin ? formatCurrency(results.suggestedProfit) : '--'}
                     </div>
                   </div>
                   <div className="text-right space-y-1">
                     <span className="text-gray-500 uppercase">Target Margin</span>
                     <div className="text-brand-accent font-bold text-sm">
                       {state.targetMargin}%
                     </div>
                   </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-4">
                 <div className="flex justify-between items-center mb-1">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Manual Override (手動)</label>
                   {results.isManualMode && (
                     <span className="text-brand-accent text-[10px] font-black animate-pulse uppercase tracking-widest">● Active</span>
                   )}
                 </div>
                 <div className="flex items-center gap-2 sm:gap-4 bg-gray-900 border-b-2 border-gray-700 p-3 sm:p-4 focus-within:border-brand-accent transition-all">
                    <span className="text-lg sm:text-xl font-mono font-black text-gray-600">NT$</span>
                    <input 
                      type="number"
                      value={state.manualRetailPrice || ''}
                      onChange={(e) => handleInputChange('manualRetailPrice', e.target.value)}
                      placeholder="Custom..."
                      className="w-full bg-transparent text-right text-white font-mono text-xl sm:text-2xl font-black focus:outline-none placeholder-gray-800"
                    />
                    <div className="min-w-[60px] sm:min-w-[80px] text-right border-l border-gray-800 pl-2 sm:pl-4">
                      <div className={`font-mono font-black text-base sm:text-lg ${getMarginColorClass(results.manualMargin)}`}>
                        {results.isManualMode ? `${results.manualMargin.toFixed(1)}%` : '--'}
                      </div>
                    </div>
                 </div>
              </div>

              {/* Discount Scenarios */}
              <div className="space-y-4">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Simulation: Discounts</div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {scenarios.map((sc) => {
                    const discountedPrice = results.effectivePrice * sc.rate;
                    const discountedMargin = discountedPrice > 0 
                      ? ((discountedPrice - results.landedCost) / discountedPrice) * 100 
                      : 0;
                    
                    return (
                      <div key={sc.label} className="bg-gray-900/50 border border-gray-800 p-2 sm:p-3 text-center space-y-1">
                        <div className={`${sc.color} text-black text-[10px] font-black px-1 uppercase inline-block mb-1`}>{sc.label}</div>
                        <div className="text-[10px] sm:text-xs font-mono font-bold text-white truncate">
                          {results.effectivePrice > 0 ? formatCurrency(discountedPrice) : '--'}
                        </div>
                        <div className={`text-[10px] font-mono font-bold ${getMarginColorClass(discountedMargin)}`}>
                          {results.effectivePrice > 0 ? `${discountedMargin.toFixed(1)}%` : '--'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <footer className="bg-gray-100 p-4 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] gap-4">
           <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span className="text-black/40">© 2024 MARGIN MAESTRO</span>
              <span className="hidden sm:inline text-black/20">|</span>
              <span className="text-black/40">ALL RIGHTS RESERVED</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-black/60">ENGINEERED BY</span>
             <span className="bg-black text-white px-2 py-0.5 font-sans">RYUUU_DEV</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
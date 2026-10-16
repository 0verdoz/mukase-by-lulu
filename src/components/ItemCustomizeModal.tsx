import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, ShieldAlert } from 'lucide-react';
import { CustomizationOption, MenuItem, SpiceLevel } from '../types';
import { useOrder } from '../context/OrderContext';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

const SPICE_LEVELS: { level: SpiceLevel; label: string; desc: string }[] = [
  { level: 'Mild', label: 'Mild', desc: 'Gentle warmth, family-friendly' },
  { level: 'Medium', label: 'Medium', desc: 'Noticeable scotch bonnet kick' },
  { level: 'Hot (Traditional)', label: 'Traditional Hot', desc: 'Authentic Ghanaian street level heat' },
  { level: 'Extra Fiery Shito', label: 'Extra Fiery Shito', desc: 'Double shito & fresh ground pepper' },
];

export const ItemCustomizeModal: React.FC<Props> = ({ item, onClose }) => {
  const { addToCart } = useOrder();

  const [selectedProtein, setSelectedProtein] = useState<string>(
    item.proteinOptions && item.proteinOptions.length > 0 ? item.proteinOptions[0].name : ''
  );
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel>('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Compute protein extra
  const proteinObj = item.proteinOptions?.find(p => p.name === selectedProtein);
  const proteinExtra = proteinObj ? proteinObj.extraPrice : 0;

  // Compute add-ons total
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  // Single unit price
  const unitPrice = item.price + proteinExtra + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addOn: CustomizationOption) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.id === addOn.id);
      if (exists) {
        return prev.filter(a => a.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleAdd = () => {
    addToCart(
      item,
      {
        protein: selectedProtein || undefined,
        proteinExtraPrice: proteinExtra,
        spiceLevel: selectedSpiceLevel,
        selectedAddOns,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full bg-stone-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl sm:text-2xl font-bold font-display">{item.name}</h3>
            <p className="text-xs sm:text-sm text-stone-200 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Protein Selection */}
          {item.proteinOptions && item.proteinOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 font-display">
                  1. Choice of Protein <span className="text-amber-700">*</span>
                </label>
                <span className="text-xs text-stone-500">Select one</span>
              </div>

              <div className="space-y-2">
                {item.proteinOptions.map(protein => {
                  const isSelected = selectedProtein === protein.name;
                  return (
                    <button
                      key={protein.name}
                      type="button"
                      onClick={() => setSelectedProtein(protein.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all text-sm ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span>{protein.name}</span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-stone-600">
                        {protein.extraPrice > 0 ? `+$${protein.extraPrice.toFixed(2)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Heat Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 font-display flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>2. Spice Heat Level</span>
              </label>
              <span className="text-xs text-stone-500">Accra heat scale</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SPICE_LEVELS.map(spice => {
                const isSelected = selectedSpiceLevel === spice.level;
                return (
                  <button
                    key={spice.level}
                    type="button"
                    onClick={() => setSelectedSpiceLevel(spice.level)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-stone-900">{spice.label}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{spice.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons (Egg, Sausage, Kelewele, Shito, etc.) */}
          {item.availableAddOns && item.availableAddOns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 font-display">
                  3. Delicious Add-Ons & Sides
                </label>
                <span className="text-xs text-stone-500">Optional</span>
              </div>

              <div className="space-y-2">
                {item.availableAddOns.map(addOn => {
                  const isChecked = selectedAddOns.some(a => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      type="button"
                      onClick={() => toggleAddOn(addOn)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all text-sm ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addOn.name}</span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-amber-800">
                        +${addOn.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Note */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 font-display">
              Special Kitchen Notes
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g., extra spicy shito on the side, well done plantains, no onions"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 placeholder:text-stone-400"
            />
          </div>

        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4 shrink-0">
          
          {/* Quantity stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
            <button
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center font-bold text-sm tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between px-5 py-3 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all rounded-xl shadow-sm shadow-amber-600/25"
          >
            <span>Add to Order Bag</span>
            <span className="font-bold tabular-nums">${totalPrice.toFixed(2)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};

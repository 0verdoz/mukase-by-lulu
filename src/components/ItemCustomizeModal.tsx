import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, Sparkles, ChefHat, Info } from 'lucide-react';
import { CustomizationOption, MenuItem, SpiceLevel } from '../types';
import { useOrder } from '../context/OrderContext';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

const SPICE_LEVELS: { level: SpiceLevel; label: string; desc: string }[] = [
  { level: 'Mild', label: 'Mild', desc: 'Gentle warmth, family-friendly' },
  { level: 'Medium', label: 'Medium', desc: 'Noticeable scotch bonnet kick' },
  { level: 'Hot (Traditional)', label: 'Traditional Hot', desc: 'Authentic Ghanaian street heat' },
  { level: 'Extra Fiery Shito', label: 'Extra Fiery Shito', desc: 'Double shito & fresh ground pepper' },
];

export const ItemCustomizeModal: React.FC<Props> = ({ item, onClose }) => {
  const { addToCart } = useOrder();

  const isOffMenuSpecial = item.id === 'chef-off-menu-request';

  // Side / Swallow choice
  const [selectedSide, setSelectedSide] = useState<string>(
    item.sidesOptions && item.sidesOptions.length > 0 ? item.sidesOptions[0].name : ''
  );

  // Protein choice
  const [selectedProtein, setSelectedProtein] = useState<string>(
    item.proteinOptions && item.proteinOptions.length > 0 ? item.proteinOptions[0].name : ''
  );

  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel>('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Off-menu custom fields
  const [isOffMenuCustom, setIsOffMenuCustom] = useState(isOffMenuSpecial);
  const [offMenuDishName, setOffMenuDishName] = useState(
    isOffMenuSpecial ? 'Omo Tuo with Groundnut Soup & Goat' : ''
  );
  const [offMenuDetails, setOffMenuDetails] = useState('');

  // Surcharge for custom off-menu cooking
  const customPrepFee = isOffMenuSpecial || isOffMenuCustom ? 5.00 : 0;

  // Compute side extra
  const sideObj = item.sidesOptions?.find(s => s.name === selectedSide);
  const sideExtra = sideObj ? sideObj.extraPrice : 0;

  // Compute protein extra
  const proteinObj = item.proteinOptions?.find(p => p.name === selectedProtein);
  const proteinExtra = proteinObj ? proteinObj.extraPrice : 0;

  // Compute add-ons total
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  // Single unit price
  const unitPrice = item.price + sideExtra + proteinExtra + addOnsTotal + customPrepFee;
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
        selectedSideOrSwallow: selectedSide || undefined,
        protein: selectedProtein || undefined,
        proteinExtraPrice: proteinExtra + sideExtra,
        spiceLevel: selectedSpiceLevel,
        selectedAddOns,
        specialInstructions: specialInstructions.trim() || undefined,
        isOffMenuCustom: isOffMenuSpecial || isOffMenuCustom,
        offMenuDishName: (isOffMenuSpecial || isOffMenuCustom) ? offMenuDishName.trim() : undefined,
        offMenuDetails: (isOffMenuSpecial || isOffMenuCustom) ? offMenuDetails.trim() : undefined,
        customizationFee: customPrepFee,
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col"
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
            <div className="flex items-center gap-2 mb-1">
              {item.tag && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-600/90 text-white">
                  {item.tag}
                </span>
              )}
              {isOffMenuSpecial && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-600/90 text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Custom Off-Menu
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display">{item.name}</h3>
            <p className="text-xs sm:text-sm text-stone-200 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Notice about extra fee on custom foods */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Customization & Off-Menu Notice</p>
              <p className="text-[11px] text-amber-900 mt-0.5">
                Customized foods come with an extra fee. You can also request dishes outside the standard menu for Chef Lulu to prepare fresh to order.
              </p>
            </div>
          </div>

          {/* Off-Menu Special Request Inputs */}
          {isOffMenuSpecial && (
            <div className="space-y-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Off-Menu Dish Details
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Dish Name You Want Chef Lulu to Cook <span className="text-amber-700">*</span>
                </label>
                <input
                  type="text"
                  value={offMenuDishName}
                  onChange={e => setOffMenuDishName(e.target.value)}
                  placeholder="e.g. Omo Tuo with Groundnut Soup, Tuo Zaafi, Kenkey & Fish, Garden Egg Stew"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Special Ingredients / Desired Preparation
                </label>
                <textarea
                  rows={2}
                  value={offMenuDetails}
                  onChange={e => setOffMenuDetails(e.target.value)}
                  placeholder="e.g. Thick peanut broth, tender goat meat and crab, extra scotch bonnet pepper, cooked authentic Accra style"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span>Chef Off-Menu Custom Preparation Surcharge:</span>
                <span className="font-bold text-amber-800">+$5.00</span>
              </div>
            </div>
          )}

          {/* Side / Swallow Choice (for Egusi, Efo Riro, etc.) */}
          {item.sidesOptions && item.sidesOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 font-display">
                  1. Choice of Side / Swallow <span className="text-amber-700">*</span>
                </label>
                <span className="text-xs text-stone-500">Included in base price</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.sidesOptions.map(side => {
                  const isSelected = selectedSide === side.name;
                  return (
                    <button
                      key={side.name}
                      type="button"
                      onClick={() => setSelectedSide(side.name)}
                      className={`p-3 rounded-xl border text-left transition-all text-xs ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{side.name}</span>
                        <span className="text-[11px] font-mono text-stone-500">
                          {side.extraPrice > 0 ? `+$${side.extraPrice.toFixed(2)}` : 'Included'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Protein Selection / Upgrade */}
          {item.proteinOptions && item.proteinOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 font-display">
                  {item.sidesOptions ? '2. Meat / Protein Upgrade' : '1. Protein Choice'}
                </label>
                <span className="text-xs text-stone-500">Custom options</span>
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
                        <span className="text-xs font-semibold">{protein.name}</span>
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
                <span>Spice Heat Level</span>
              </label>
              <span className="text-xs text-stone-500">Accra scotch bonnet scale</span>
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
                  Custom Add-Ons & Sides (Extra Fee)
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
                        <span className="text-xs font-semibold">{addOn.name}</span>
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

          {/* Toggle for Custom Request outside menu if on a regular dish */}
          {!isOffMenuSpecial && (
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOffMenuCustom}
                    onChange={e => setIsOffMenuCustom(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Request Custom Off-Menu Preparation (+ $5.00 fee)</span>
                </label>
              </div>

              {isOffMenuCustom && (
                <div className="pt-2 space-y-2">
                  <input
                    type="text"
                    value={offMenuDishName}
                    onChange={e => setOffMenuDishName(e.target.value)}
                    placeholder="Specify special custom dish or modification"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                  <p className="text-[11px] text-stone-500">
                    Chef Lulu will custom prepare this item with your specified ingredients.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Special Instructions Note */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 font-display">
              Special Kitchen Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. extra spicy shito on the side, well-done plantains, no onions"
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

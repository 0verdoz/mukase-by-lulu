import React, { useState, useMemo } from 'react';
import { Plus, SlidersHorizontal, Flame, Search, Check, Sparkles, ChefHat } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { MENU_ITEMS } from '../data/menu';
import { useOrder } from '../context/OrderContext';

type CategoryFilter = 'all' | MenuCategory;

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: `All Dishes (${MENU_ITEMS.length})` },
  { id: 'jollof', label: 'Smoky Jollof' },
  { id: 'banku-fufu', label: 'Banku, Fufu & Acheke' },
  { id: 'soups-stews', label: 'Soups, Waakye & Red Red' },
  { id: 'yam-cassava', label: 'Yam & Cassava' },
  { id: 'chops-sides', label: 'Small Chops & Kelewele' },
  { id: 'custom-chef', label: 'Custom & Off-Menu ($28+)' },
];

export const MenuSection: React.FC = () => {
  const { setCustomizingItem, addToCart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleItemClick = (item: MenuItem) => {
    if (item.isCustomizable) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
      setAddedItemNotice(item.id);
      setTimeout(() => setAddedItemNotice(null), 1800);
    }
  };

  const offMenuSpecialItem = MENU_ITEMS.find(i => i.id === 'chef-off-menu-request');

  return (
    <section id="menu-section" className="py-10 sm:py-14 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              Fresh Daily Batches · Ghanaian & West African Kitchen
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
              Chef Lulu’s Complete Kitchen Menu
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Authentic Jollof, Banku, Pounded Fufu with goat light soup, Waakye, Egusi, fried yam, and crispy pepper wings.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search jollof, banku, fufu, egusi..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Custom Off-Menu Callout Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-stone-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Customizable Dishes & Off-Menu Special Requests</span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold font-display text-white">
              Want Egusi/Efo Riro with your choice of swallow, or an off-menu dish?
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Customize Egusi & Efo Riro with Pounded Yam, Eba, Fufu, or Banku ($28+). You can also request custom dishes outside the menu (Omo Tuo, Tuo Zaafi, Kenkey & Fish, Garden Egg Stew) at an extra fee.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (offMenuSpecialItem) setCustomizingItem(offMenuSpecialItem);
            }}
            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-600/30 whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
          >
            <ChefHat className="w-4 h-4 text-stone-950" />
            <span>Order Off-Menu Custom ($28+)</span>
          </button>
        </div>

        {/* Filter Navigation (Interactive segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/25 font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid: compact 4-column desktop, 2-column mobile layout */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 my-6">
            <p className="text-stone-500 text-sm">No dishes matched "{searchQuery}".</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
            {filteredItems.map(item => {
              const isJustAdded = addedItemNotice === item.id;
              const isCustomizable = item.isCustomizable;
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Card Media */}
                  <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('jollof_chicken.jpeg')) {
                          target.src = '/assets/images/jollof_chicken.jpeg';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-50" />

                    {/* Subtle Tag if present */}
                    {item.tag && (
                      <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 text-[10px] font-semibold bg-stone-900/80 backdrop-blur-md text-amber-200 rounded">
                        {item.tag}
                      </span>
                    )}

                    {/* Spice heat indicator */}
                    {typeof item.spicyLevel === 'number' && item.spicyLevel > 0 && (
                      <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-stone-900/75 backdrop-blur-sm px-1.5 py-0.5 rounded">
                        <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{item.spicyLevel === 1 ? 'Mild' : item.spicyLevel === 2 ? 'Med' : 'Hot'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        title={item.name}
                        className="text-xs sm:text-sm md:text-base font-bold text-stone-900 font-display line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors min-h-[2rem] sm:min-h-[2.5rem]"
                      >
                        {item.name}
                      </h3>



                      {isCustomizable && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                          <SlidersHorizontal className="w-3 h-3 text-amber-700 shrink-0" />
                          <span className="truncate">{item.sidesLabel && item.proteinLabel ? `${item.sidesLabel} & ${item.proteinLabel}` : (item.sidesLabel || item.proteinLabel || 'Customizable Options')}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Action Button & Price */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-stone-900 tabular-nums shrink-0">
                        ${item.price.toFixed(2)}
                        {isCustomizable && '+'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl transition-all active:scale-[0.98] ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : isCustomizable
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                            : 'bg-stone-900 hover:bg-amber-600 text-white shadow-sm'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : isCustomizable ? (
                          <>
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Customize</span>
                            <span className="sm:hidden">Custom</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

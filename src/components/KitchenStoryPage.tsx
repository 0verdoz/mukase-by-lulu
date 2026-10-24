import React, { useEffect } from 'react';
import { ChefHat, Flame, ShieldCheck, Sparkles, Clock, ArrowRight, UtensilsCrossed, Leaf, CheckCircle2, MessageCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const KitchenStoryPage: React.FC = () => {
  const { setCurrentView, setIsChatOpen } = useOrder();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <article className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20 selection:bg-amber-200 selection:text-amber-900">
      
      {/* Hero Header Section */}
      <header className="relative bg-stone-950 text-white overflow-hidden py-16 sm:py-24 border-b border-stone-800">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/assets/images/kitchen_hearth_story_1792548370365.jpg"
            alt="Authentic Ghanaian Mukase hearth kitchen with cast iron pot simmering on open firewood"
            className="w-full h-full object-cover object-center filter saturate-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>The Heart of West African Cooking</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white max-w-3xl mx-auto leading-[1.1]">
            Our Kitchen Story: The Soul of <span className="text-amber-400 italic">Mukase</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            In Akan tradition, food is never made in a rush. It is born at the hearth, where patience, woodsmoke, and generations of ancestral intuition turn simple ingredients into unforgettable memories.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02]"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore Today's Menu</span>
            </button>

            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Ask Lulu Concierge</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Story Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16 sm:space-y-24">

        {/* Section 1: What is Mukase? */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Chapter 1: The Hearth</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-stone-900">
              Mukase is Where the Compound Comes Alive
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              In the Twi and Fante dialects spoken across Ghana, <strong>"Mukase"</strong> literally translates to <em>the kitchen</em>. But anyone raised in West Africa knows Mukase is far more than an ordinary kitchen room.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              It is the outdoor hearth where iron tripods balance massive black Dutch ovens over burning neem and mahogany logs. It is where grandmothers grind whole scotch bonnets, fresh ginger, garlic, and cloves in deeply ridged clay <em>asankas</em>. It is where secrets are passed down not by cups and tablespoons, but by the fragrance rising in the steam.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-stone-500">
              <span className="flex items-center gap-1.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Kumasi & Accra Roots
              </span>
              <span className="flex items-center gap-1.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Handcrafted Heritage
              </span>
              <span className="flex items-center gap-1.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> 100% Fresh Daily
              </span>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[4/3] group">
              <img
                src="/assets/images/fufu_goat_realistic_1792548343545.jpg"
                alt="Ghanaian culinary master stirring golden goat light soup over hearth"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-medium">
                Pounded Fufu and goat light soup simmered in traditional earthenware
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Sacred 6-Hour Black Shito */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-100 aspect-[4/3] group">
                <img
                  src="/assets/images/shito_jar_realistic_1792548387313.jpg"
                  alt="Jar of artisanal slow-cooked black shito pepper sauce with wooden spoon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase">
                  6-Hour Reduction
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-5 order-1 md:order-2">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold tracking-widest uppercase">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Chapter 2: The Black Gold</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-stone-900">
                The 6-Hour Slow-Caramelized Shito
              </h2>
              <p className="text-stone-600 text-base leading-relaxed">
                You cannot fake authentic Ghanaian Shito. Commercial shortcuts use bitter powders and fillers. At Lulu's, we begin before dawn with wild-caught coastal smoked dried crayfish, whole smoked catfish, caramelized sweet onions, grated ginger root, crushed garlic, and fiery sun-dried chili.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Stirred continuously for over six hours over gentle embers, the natural sugars in the onion caramelize into deep, glossy ebony caviar. The result is an explosive umami bomb—savory, oceanic, smoky, and intensely comforting.
              </p>
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                <strong>Chef Lulu's Rule:</strong> Every spoonful must reveal flakes of whole dried shrimp and the unmistakable warmth of crushed African grains of paradise.
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: The Pillars of Our Menu */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700">
              <Leaf className="w-4 h-4" />
              <span>Chapter 3: The Sacred Staples</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-900">
              What Real West African Food Tastes Like
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Each dish on our menu honors precise regional traditions. What is written on our menu is exactly what is delivered—never compromised, never diluted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Smoky Party Jollof */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img
                  src="/assets/images/jollof_goat.jpeg"
                  alt="Smoky Ghanaian party jollof rice with tender goat meat"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">Smoky Party Jollof</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Simmered in slow-roasted plum tomato reduction with bay leaves, thyme, and ginger. We coax out that prized "bottom-pot" campfire aroma naturally without synthetic liquid smoke. Served strictly with tender goat meat cutlets, crispy wings, or seasoned whole fish.
              </p>
            </div>

            {/* Card 2: Accra Street Waakye */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img
                  src="/assets/images/waakye_realistic_1792548345012.jpg"
                  alt="Accra street waakye rice and beans platter with spaghetti, gari, and shito on banana leaf"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">Accra Street Waakye</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Rice and black-eyed peas cooked with indigenous red sorghum leaves, creating its trademark earthy mahogany hue. Accompanied by talia noodles, savory gari foto, boiled egg with pepper salt, stewed beef, and black shito.
              </p>
            </div>

            {/* Card 3: Authentic Banku & Fufu */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
              <div className="rounded-xl overflow-hidden aspect-[4/3]">
                <img
                  src="/assets/images/banku_okro_realistic_1792548327249.jpg"
                  alt="Steamed Banku in traditional clay asanka bowl filled with rich crab okro soup"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">Living Swallows & Soups</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Banku fermented for three full days for its signature sourdough tang, matched with mucilaginous green okro soup loaded with blue crab and smoked fish. Or velvety hand-pounded fufu floating in peppery goat light soup.
              </p>
            </div>

          </div>
        </section>

        {/* Section 4: Pure Ingredients, Zero Compromises */}
        <section className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Our Heritage Promise</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                Genuine West African Sourcing
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                We refuse to substitute ingredients. Our fried and boiled yam is exclusively genuine <strong>Ghanaian Pona white yam</strong>—dry, fluffy, and golden when crisped, never sweet potatoes. Our palm oil is cold-pressed red zomi palm oil, and our dried smoked catfish is sourced directly through trusted artisan networks.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
                <div className="border-l-2 border-amber-500 pl-3 space-y-1">
                  <span className="font-bold text-white block">No Parboiled Shortcuts</span>
                  <p className="text-stone-400">Rice steeped in natural broth until every grain absorbs the sofrito.</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
                  <span className="font-bold text-white block">Anti-Scam Transparency</span>
                  <p className="text-stone-400">Automated transaction memos prevent payment fraud confusion.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="rounded-2xl overflow-hidden border border-stone-700 shadow-2xl aspect-[4/3] w-full max-w-sm">
                <img
                  src="/assets/images/fried_yam_fish_realistic_1792548345718.jpg"
                  alt="Crispy white pona yam chips served with seasoned fried whole red fish and dark shito"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Section 5: The Chef & Custom Requests */}
        <section className="bg-amber-500/10 border border-amber-200/80 rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Customized Cooking</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
                Craving Something Outside the Menu?
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentView('menu');
                setTimeout(() => {
                  const customSection = document.getElementById('category-custom-chef');
                  customSection?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
            >
              View Custom Options ($28+)
            </button>
          </div>

          <p className="text-stone-700 text-sm leading-relaxed">
            Because Mukase is a real kitchen, not a frozen food warehouse, Chef Lulu prepares off-menu requests tailored to your childhood memories. Whether you need <strong>Omo Tuo with Groundnut Soup</strong>, <strong>Kenkey with Fried Fish and Raw Pepper</strong>, <strong>Catfish Pepper Soup</strong>, or <strong>Garden Egg Stew</strong>, let us know in your order notes or through our Concierge chat.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 text-stone-700 font-medium">Egusi Soup with Custom Swallow</span>
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 text-stone-700 font-medium">Efo Riro with Custom Meats</span>
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 text-stone-700 font-medium">Kenkey & Ga Fish</span>
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 text-stone-700 font-medium">Omo Tuo Groundnut Stew</span>
          </div>
        </section>

        {/* Section 6: Ready to Order Banner */}
        <section className="text-center space-y-6 pt-4 pb-8 border-t border-stone-200">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-900">
            Taste the Fire of Our Kitchen Today
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Fresh daily batches are prepared in limited quantities. Order now for express Midtown delivery or scheduled evening dispatch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-600/25 transition-all hover:scale-[1.02]"
            >
              <span>Go to Kitchen Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('track')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-sm font-semibold transition-colors"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Track Active Order</span>
            </button>
          </div>
        </section>

      </div>

    </article>
  );
};

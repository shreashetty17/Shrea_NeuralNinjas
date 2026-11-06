import React from 'react';
import { BoltHeroBright } from '../components/BoltHeroBright';
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Utensils, 
  AirVent, 
  Hammer,
  ShieldCheck, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerHome = ({
  onFindWorker,
  onSelectCategory,
  onNavigatePage,
  onOpenChat,
  hasActiveBooking = false,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const tradeIcons = {
    plumbing: Wrench,
    electrical: Zap,
    cleaning: Sparkles,
    cooking: Utensils,
    ac_repair: AirVent,
    carpentry: Hammer
  };

  const getCategoryName = (cat) => {
    if (lang === 'hi') return cat.nameHi || cat.name;
    if (lang === 'mr') return cat.nameMr || cat.name;
    return cat.name;
  };

  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <BoltHeroBright
        onFindWorker={onFindWorker}
        onExploreServices={() => onNavigatePage('services')}
        lang={lang}
      />

    </div>
  );
};

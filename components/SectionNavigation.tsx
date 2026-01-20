import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type Props = {
  sections?: { id: string; label: string }[];
};

export const SectionNavigation: React.FC<Props> = ({ sections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!sections?.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (direction: 'up' | 'down') => {
    if (!sections?.length) return;

    let targetIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < sections.length - 1) {
      targetIndex = currentIndex + 1;
    }

    const element = document.getElementById(sections[targetIndex].id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!sections?.length) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => scrollToSection('up')}
        disabled={currentIndex === 0}
        className="p-2 rounded-lg text-purple-400/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Previous section"
      >
        <ChevronUp size={18} />
      </button>
      <button
        onClick={() => scrollToSection('down')}
        disabled={currentIndex === sections.length - 1}
        className="p-2 rounded-lg text-purple-400/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Next section"
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
};

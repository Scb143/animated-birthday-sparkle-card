import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Heart, Sparkles, Cake } from 'lucide-react';
import { toast } from 'sonner';
import birthdayHero from '@/assets/birthday-hero.jpg';

const confettiColors = ['#FF6B9D', '#C44EFF', '#FFD93D', '#FF8C42'];

const Confetti = ({ isActive }: { isActive: boolean }) => {
  const [pieces, setPieces] = useState<Array<{ id: number; color: string; delay: number; left: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 2,
        left: Math.random() * 100,
      }));
      setPieces(newPieces);

      // Clear confetti after animation
      const timer = setTimeout(() => setPieces([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-confetti-fall"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const FloatingIcon = ({ icon: Icon, className = "", delay = 0 }: { 
  icon: React.ComponentType<any>; 
  className?: string; 
  delay?: number;
}) => (
  <div 
    className={`absolute animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon className="w-8 h-8 text-accent" />
  </div>
);

export const BirthdayCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const birthdayWishes = [
    "🎉 Wishing you a day filled with happiness and a year filled with joy!",
    "🎂 May all your birthday wishes come true!",
    "✨ Another year older, another year wiser, another year more fabulous!",
    "🎈 Hope your special day brings you all that your heart desires!",
    "🎊 May your birthday be the start of a year filled with good luck!",
  ];

  const handleCelebrate = () => {
    if (!hasAnimated) {
      setHasAnimated(true);
    }
    
    const randomWish = birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)];
    setIsFlipped(true);
    setShowConfetti(true);
    
    toast(randomWish, {
      duration: 4000,
      className: "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none",
    });

    // Reset flip after 4 seconds
    setTimeout(() => {
      setIsFlipped(false);
    }, 4000);

    // Stop confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-accent/20" />
      
      {/* Floating decorative elements */}
      <FloatingIcon icon={Sparkles} className="top-20 left-10" delay={0} />
      <FloatingIcon icon={Heart} className="top-32 right-20" delay={1} />
      <FloatingIcon icon={Gift} className="bottom-32 left-20" delay={2} />
      <FloatingIcon icon={Cake} className="bottom-20 right-10" delay={0.5} />
      
      {/* Confetti */}
      <Confetti isActive={showConfetti} />

      {/* Main card container with 3D perspective */}
      <div className="relative perspective-1000">
        <div 
          className={`relative w-96 h-96 transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          } ${hasAnimated ? 'animate-bounce-in' : ''}`}
        >
          {/* Front of card */}
          <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-card via-primary/5 to-secondary/20 border-2 border-primary/20 shadow-2xl hover:shadow-birthday transition-all duration-500">
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="relative">
                <img 
                  src={birthdayHero} 
                  alt="Birthday celebration" 
                  className="w-48 h-32 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute -top-2 -right-2 animate-pulse-glow">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground tracking-wide">
                  🎉 Happy Birthday! 🎂
                </h1>
                <p className="text-lg text-muted-foreground">
                  Make a wish and click to celebrate!
                </p>
              </div>

              <Button 
                onClick={handleCelebrate}
                size="lg"
                className="bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-semibold text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-float animate-pulse-glow"
              >
                <Gift className="w-6 h-6 mr-2" />
                Celebrate! 🎊
              </Button>
            </div>
          </Card>

          {/* Back of card */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-accent via-primary/10 to-secondary/30 border-2 border-accent/30 shadow-2xl">
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="animate-bounce-in">
                <div className="text-8xl mb-4">🎁</div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Surprise! 🎉
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Your special day deserves all the joy in the world!
                </p>
                <div className="flex space-x-4 text-4xl">
                  <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎈</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎂</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎊</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎁</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional floating elements when card is flipped */}
      {isFlipped && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float text-4xl">🌟</div>
          <div className="absolute top-1/3 right-1/4 animate-float text-4xl" style={{ animationDelay: '1s' }}>🎈</div>
          <div className="absolute bottom-1/4 left-1/3 animate-float text-4xl" style={{ animationDelay: '2s' }}>🎁</div>
          <div className="absolute bottom-1/3 right-1/3 animate-float text-4xl" style={{ animationDelay: '0.5s' }}>🎂</div>
        </div>
      )}
    </div>
  );
};
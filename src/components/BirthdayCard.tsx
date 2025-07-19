import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Heart, Sparkles, Cake, Upload, Calendar, User, Camera } from 'lucide-react';
import { toast } from 'sonner';
import birthdayHero from '@/assets/birthday-hero.jpg';

const confettiColors = ['#FF6B9D', '#C44EFF', '#FFD93D', '#FF8C42'];

interface BirthdayDetails {
  name: string;
  birthDate: string;
  photo: string | null;
}

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

const PersonalizationForm = ({ 
  details, 
  onUpdate, 
  onComplete 
}: { 
  details: BirthdayDetails;
  onUpdate: (details: BirthdayDetails) => void;
  onComplete: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpdate({ ...details, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isFormComplete = details.name.trim() && details.birthDate;

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-card via-primary/5 to-secondary/20 border-2 border-primary/20 shadow-xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">🎂</div>
          <h2 className="text-2xl font-bold text-foreground">Create Birthday Card</h2>
          <p className="text-muted-foreground">Add personal details to make it special!</p>
        </div>

        <div className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-foreground font-medium">
              <User className="w-4 h-4" />
              Birthday Person's Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter name..."
              value={details.name}
              onChange={(e) => onUpdate({ ...details, name: e.target.value })}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2 text-foreground font-medium">
              <Calendar className="w-4 h-4" />
              Birthday Date
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={details.birthDate}
              onChange={(e) => onUpdate({ ...details, birthDate: e.target.value })}
              className="border-primary/20 focus:border-primary"
            />
            {details.birthDate && (
              <p className="text-sm text-accent font-medium">{formatDate(details.birthDate)}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground font-medium">
              <Camera className="w-4 h-4" />
              Photo (Optional)
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border-primary/20 hover:border-primary"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
              {details.photo && (
                <div className="relative">
                  <img 
                    src={details.photo} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        <Button 
          onClick={onComplete}
          disabled={!isFormComplete}
          className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-semibold py-3 rounded-full transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Gift className="w-5 h-5 mr-2" />
          Create Birthday Card 🎉
        </Button>
      </div>
    </Card>
  );
};

export const BirthdayCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [birthdayDetails] = useState<BirthdayDetails>({
    name: 'S.Harsha Vardhan Reddy',
    birthDate: '2005-07-27',
    photo: '/lovable-uploads/cfb8550e-ab1a-4f91-916f-393cf762c6b8.png'
  });

  const formatBirthdayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const birthdayWishes = [
    `🎉 Happy Birthday ${birthdayDetails.name}! Wishing you a day filled with happiness and a year filled with joy!`,
    `🎂 ${birthdayDetails.name}, may all your birthday wishes come true!`,
    `✨ Another year older, another year wiser, another year more fabulous ${birthdayDetails.name}!`,
    `🎈 Hope your special day brings you all that your heart desires, ${birthdayDetails.name}!`,
    `🎊 May your birthday be the start of a year filled with good luck, ${birthdayDetails.name}!`,
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

    setTimeout(() => setIsFlipped(false), 4000);
    setTimeout(() => setShowConfetti(false), 3000);
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
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
              {/* Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
                  <img 
                    src={birthdayDetails.photo || birthdayHero} 
                    alt={birthdayDetails.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 animate-pulse-glow">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
              </div>
              
              {/* Name and Birthday Info */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground tracking-wide">
                  🎉 Happy Birthday 🎂
                </h1>
                <h2 className="text-2xl font-bold text-primary">
                  {birthdayDetails.name}!
                </h2>
                {birthdayDetails.birthDate && (
                  <div className="space-y-1">
                    <p className="text-lg text-accent font-semibold">
                      {formatBirthdayDate(birthdayDetails.birthDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Turning {calculateAge(birthdayDetails.birthDate)} years amazing! ✨
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleCelebrate}
                size="lg"
                className="bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-semibold text-lg px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-float animate-pulse-glow"
              >
                <Gift className="w-5 h-5 mr-2" />
                Celebrate! 🎊
              </Button>
            </div>
          </Card>

          {/* Back of card */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-accent via-primary/10 to-secondary/30 border-2 border-accent/30 shadow-2xl">
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="animate-bounce-in">
                <div className="text-6xl mb-4">🎁</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Surprise {birthdayDetails.name}! 🎉
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Your special day deserves all the joy in the world!
                </p>
                <div className="flex space-x-4 text-3xl mb-4">
                  <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎈</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎂</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎊</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎁</span>
                </div>
                <p className="text-sm text-accent font-medium">
                  Hope this year brings you endless happiness! 💫
                </p>
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
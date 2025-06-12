import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/game';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !age || !gender) {
      alert('Please fill in all fields');
      return;
    }

    onComplete({
      firstName,
      lastName,
      age: parseInt(age),
      gender: gender as 'boy' | 'girl'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-full h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-t-lg mb-4 bg-cover bg-center"
               style={{
                 backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200')"
               }}>
          </div>
          <CardTitle className="text-3xl font-game font-bold text-forest">
            Tell Us About You! 🌿
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                First Name:
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 border-2 border-sage focus:border-forest"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                Last Name:
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 border-2 border-sage focus:border-forest"
                required
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-sm font-semibold text-gray-700">
                Age:
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-2 border-2 border-sage focus:border-forest"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Gender:
              </Label>
              <Select value={gender} onValueChange={(value) => setGender(value as 'boy' | 'girl')}>
                <SelectTrigger className="mt-2 border-2 border-sage focus:border-forest">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boy">Boy</SelectItem>
                  <SelectItem value="girl">Girl</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-forest hover:bg-forest/90 text-white font-bold py-3 shadow-lg"
            >
              Start Your Garden Adventure! 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

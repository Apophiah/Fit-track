export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface Profile {
  fullName: string;
  email: string;
  goal: string;
  avatar: string;
  age?: number;
  weight?: number;
  height?: number;
}

export interface DashboardStats {
  steps: number;
  calories: number;
  distance: number;
  heartRate: number;
}

export interface Workout {
  id: string;
  type: 'Cardio' | 'Strength' | 'Flexibility' | 'HIIT' | 'Yoga';
  date: string;
  duration: number;
  notes: string;
}

export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  food: string;
  calories: number;
  date: string;
  notes: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface WeeklyStats {
  steps: number[];
  calories: number[];
  distance: number[];
  heartRate: number[];
}

export interface Post {
  id: string;
  username: string;
  content: string;
  likes: number;
  liked: boolean;
  timestamp: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
}

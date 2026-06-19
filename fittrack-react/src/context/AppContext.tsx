import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Profile, DashboardStats, Workout, Meal, WeeklyStats, Post, Goal } from '../types';

interface AppContextType {
  // Auth
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  signup: (name: string, username: string, password: string) => boolean;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Profile
  profile: Profile;
  saveProfile: (p: Profile) => void;

  // Dashboard stats
  stats: DashboardStats;
  saveStats: (s: DashboardStats) => void;

  // Workouts
  workouts: Workout[];
  addWorkout: (w: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;

  // Meals
  meals: Meal[];
  addMeal: (m: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;

  // Weekly progress
  weeklyStats: WeeklyStats;
  saveWeeklyStats: (s: WeeklyStats) => void;

  // Community
  posts: Post[];
  addPost: (username: string, content: string) => void;
  toggleLike: (id: string) => void;
  addComment: (postId: string, username: string, text: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id' | 'completed'>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, current: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultWeeklyStats: WeeklyStats = {
  steps: [7000, 8000, 8200, 8500, 9000, 8700, 8420],
  calories: [480, 510, 520, 530, 500, 540, 520],
  distance: [4.5, 5.0, 5.1, 5.3, 5.5, 5.2, 5.3],
  heartRate: [75, 78, 80, 79, 76, 77, 78],
};

const defaultProfile: Profile = {
  fullName: '',
  email: '',
  goal: '',
  avatar: '',
};

const defaultStats: DashboardStats = {
  steps: 8420,
  calories: 520,
  distance: 5.3,
  heartRate: 78,
};

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('loggedInUser'));
  const [darkMode, setDarkMode] = useState<boolean>(() => load('fittrack_dark', false));
  const [profile, setProfile] = useState<Profile>(() => load('fittrack_profile', defaultProfile));
  const [stats, setStats] = useState<DashboardStats>(() => load('fittrack_dashstats', defaultStats));
  const [workouts, setWorkouts] = useState<Workout[]>(() => load('fittrack_workouts', []));
  const [meals, setMeals] = useState<Meal[]>(() => load('fittrack_meals', []));
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>(() => load('fittrackStats', defaultWeeklyStats));
  const [posts, setPosts] = useState<Post[]>(() => load('fittrack_posts', []));
  const [goals, setGoals] = useState<Goal[]>(() => load('fittrack_goals', []));

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    save('fittrack_dark', darkMode);
  }, [darkMode]);

  // Auth
  const login = (username: string, password: string): boolean => {
    const users: User[] = load('fittrack_users', []);
    const match = users.find(u => u.username === username && u.password === password);
    if (match) {
      localStorage.setItem('loggedInUser', username);
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setCurrentUser(null);
  };

  const signup = (name: string, username: string, password: string): boolean => {
    const users: User[] = load('fittrack_users', []);
    if (users.find(u => u.username === username)) return false;
    const newUser: User = { id: Date.now().toString(), name, username, password };
    const updated = [...users, newUser];
    save('fittrack_users', updated);
    return true;
  };

  // Dark mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Profile
  const saveProfile = (p: Profile) => {
    setProfile(p);
    save('fittrack_profile', p);
  };

  // Stats
  const saveStats = (s: DashboardStats) => {
    setStats(s);
    save('fittrack_dashstats', s);
  };

  // Workouts
  const addWorkout = (w: Omit<Workout, 'id'>) => {
    const updated = [...workouts, { ...w, id: Date.now().toString() }];
    setWorkouts(updated);
    save('fittrack_workouts', updated);
  };
  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    save('fittrack_workouts', updated);
  };

  // Meals
  const addMeal = (m: Omit<Meal, 'id'>) => {
    const updated = [...meals, { ...m, id: Date.now().toString() }];
    setMeals(updated);
    save('fittrack_meals', updated);
  };
  const deleteMeal = (id: string) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    save('fittrack_meals', updated);
  };

  // Weekly stats
  const saveWeeklyStats = (s: WeeklyStats) => {
    setWeeklyStats(s);
    save('fittrackStats', s);
  };

  // Community
  const addPost = (username: string, content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      username,
      content,
      likes: 0,
      liked: false,
      timestamp: new Date().toISOString(),
      comments: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    save('fittrack_posts', updated);
  };

  const toggleLike = (id: string) => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    );
    setPosts(updated);
    save('fittrack_posts', updated);
  };

  const addComment = (postId: string, username: string, text: string) => {
    const updated = posts.map(p =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...p.comments,
              { id: Date.now().toString(), username, text, timestamp: new Date().toISOString() },
            ],
          }
        : p
    );
    setPosts(updated);
    save('fittrack_posts', updated);
  };

  // Goals
  const addGoal = (g: Omit<Goal, 'id' | 'completed'>) => {
    const updated = [...goals, { ...g, id: Date.now().toString(), completed: false }];
    setGoals(updated);
    save('fittrack_goals', updated);
  };
  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    save('fittrack_goals', updated);
  };
  const updateGoalProgress = (id: string, current: number) => {
    const updated = goals.map(g =>
      g.id === id ? { ...g, current, completed: current >= g.target } : g
    );
    setGoals(updated);
    save('fittrack_goals', updated);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser, login, logout, signup,
        darkMode, toggleDarkMode,
        profile, saveProfile,
        stats, saveStats,
        workouts, addWorkout, deleteWorkout,
        meals, addMeal, deleteMeal,
        weeklyStats, saveWeeklyStats,
        posts, addPost, toggleLike, addComment,
        goals, addGoal, deleteGoal, updateGoalProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

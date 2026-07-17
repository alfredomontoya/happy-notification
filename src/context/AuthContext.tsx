import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import auth from '@react-native-firebase/auth';
import {UserProfile} from '../database/types';
import {
  getUserById,
  getUserByUsername,
  createAdminUserIfNotExists,
} from '../database/usuarios';

  interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  }

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createAdminUserIfNotExists();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        const profile = await getUserById(firebaseUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      let email = usernameOrEmail;
      if (!email.includes('@')) {
        const profile = await getUserByUsername(email);
        if (!profile) {
          throw {code: 'user-not-found'};
        }
        email = profile.email;
      }
      await auth().signInWithEmailAndPassword(email, password);
    },
    [],
  );

  const logout = useCallback(async () => {
    await auth().signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{user, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

import { useAuth as useAuthContext } from '../context/AuthContext';

// Thin hook wrapper so components import from /hooks.
export const useAuth = () => useAuthContext();


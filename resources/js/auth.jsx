import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('gpi_user'));
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('gpi_token');
        if (!token) {
            setLoading(false);
            return;
        }
        api.get('/me')
            .then(({ data }) => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (identifier, password) => {
        const { data } = await api.post('/login', { email: identifier, password });
        localStorage.setItem('gpi_token', data.token);
        localStorage.setItem('gpi_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    /* Recharge l'utilisateur connecté (après édition du profil). */
    const majUtilisateur = (data) => {
        setUser(data);
        localStorage.setItem('gpi_user', JSON.stringify(data));
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('gpi_token');
            localStorage.removeItem('gpi_user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, majUtilisateur }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

/* Rôles autorisant l'écriture, selon le domaine (alignés sur routes/api.php). */
export const ROLES_ECRITURE = ['admin', 'gestionnaire_parc'];
export const ROLES_INTERVENTION = [...ROLES_ECRITURE, 'technicien'];

/** true si l'utilisateur possède au moins un des rôles donnés. */
export const aRole = (user, autorises) =>
    (user?.roles ?? []).some((r) => autorises.includes(r.nom_role));

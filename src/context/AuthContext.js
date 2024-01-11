import { createContext, useContext } from "react";
import { signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { auth } from '../firebase';

export const authContext = createContext()

export const useAuth = () => {
    
    const context = useContext(authContext);
    if (!context) throw new Error("There is no Auth provider");
    return context;

}

export function AuthProvider({children}){

    const refreshToken = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                const idToken = await user.getIdToken(/* forceRefresh */ true);
                // Aquí puedes hacer lo que quieras con el nuevo idToken
                return idToken;
            } catch (error) {
                // Manejar errores
                console.error("Error renewing ID Token:", error);
                throw error; // Puedes propagar el error si es necesario
            }
        } else {
            console.error("No user is currently signed in.");
            throw new Error("No user is currently signed in.");
        }
    }

    const user = {
        login: true
    }

    const loginwithGoogle = () => {
        const googleProvider = new GoogleAuthProvider()
        return signInWithPopup(auth, googleProvider)
    }

    return(
        <authContext.Provider value={{user, loginwithGoogle, refreshToken}}>
            {children}
        </authContext.Provider>
    )
}  

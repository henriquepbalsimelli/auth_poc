import { createRef, useContext, useEffect } from "react"
import AppContext from "../../AppContext"
import jwtDecode from 'jwt-decode'

function Authentication() {

    const loginButton = createRef()
    const { user, setUser } = useContext(AppContext)

    useEffect(() => {
        
        loadUserSession()
        inicializarLogin()

    }, [user])
    
    function loadUserSession() {
        if (user){
            return
        }
        const token = sessionStorage.getItem('user')
        if (token) {
            setGoogleUser(token)
        }
    }

    function inicializarLogin() {

        if (user) {
            return
        }

        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleLoginCallback
        })

        if (!user) {          
            google.accounts.id.renderButton(loginButton.current, {
                theme: 'filled_blue',
                size: 'large'
            })
        }
    }

    function handleLoginCallback(response) {
        if (response.credential) {
            setGoogleUser(response.credential)
            sessionStorage.setItem('user', response.credential)
        }
    }

    function setGoogleUser(token) {
        const goooglePayload = jwtDecode(token)

        const googleUser = {
            email: goooglePayload.email,
            email_verified: goooglePayload.email_verified,
            name: goooglePayload.name,
            picture: goooglePayload.picture  
        }

        setUser(googleUser)
    }

    function handleLogout() {

        if (user.email) {
            google.accounts.id.revoke(user.email, done => {
                console.log('user revoked');
            })
        }

        setUser(null)
        sessionStorage.removeItem('user')
        window.location.href = '/'
    }

    return(
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            { !user && 
                <div ref={loginButton} id="loginButton"></div>
            }            

            { user && 
                <footer style={{ 
                    position: "fixed", 
                    bottom: 0, 
                    minHeight: "60px",
                    width: "100%",
                    background: "#444",
                    color: "#eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                     }}>

                    <div style={{display: "flex" }}>
                        <p><strong>Usuário:</strong> <span>{user.name}</span></p>
                        <p><strong>Email:</strong> <span>{user.email}</span></p>
                    </div>

                    <div>
                        <a style={{color: "#eee", margin: "0 2rem", fontWeight: "bold"}} onClick={handleLogout}>Trocar Usuário</a>
                    </div>
                    
                </footer>
            }
        </div>
    )
}

export default Authentication
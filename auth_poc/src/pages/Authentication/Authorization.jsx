import { createRef, useContext, useEffect, useRef, useState } from "react"
import AppContext from "../../AppContext"
import jwtDecode from 'jwt-decode'

import axios from "axios";

function Authorization() {

    const { params, user, setUser } = useContext(AppContext)
    
    const [authCode, setAuthCode] = useState()
    const [accessToken, setAccessToken] = useState()
    
    let initialized = useRef()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        if (initialized.current) {
            return
        }
        
        initAuthorizationCode()
        initAccessToken()
        initialized.current = true

    }, [])

    useEffect(() => {
        
        initUserProfile()

    }, [accessToken])

    function initAuthorizationCode() {
        
        // check for authorizationCode request callback
        if (params['code']) {
            sessionStorage.setItem('authCode', params['code'])
            setAuthCode(params['code'])
            return
        }

        // check session cache
        const sessionAuthCode = sessionStorage.getItem('authCode')
        if (sessionAuthCode) {
            setAuthCode(sessionAuthCode)
        }
    }

    function initAccessToken() {

        // check session cache
        const sessionAccessToken = sessionStorage.getItem('accessToken')
        const tokenExpiration = sessionStorage.getItem('tokenExpiration')
        
        if (sessionAccessToken) {
            
            // check token expiration
            if (new Date(tokenExpiration) < new Date()) {
                console.log('token expired! Request a new access token...')
                sessionStorage.removeItem('accessToken')
                setAccessToken(null)
                requestAccessToken()
                return
            }
            
            // set token
            setAccessToken(sessionAccessToken)
        }
        else if (!isLoading) {

            // request accessToken
            requestAccessToken()

        }
        
    }

    function initUserProfile() {
        console.log('init user profile...')
        const sessionUser = sessionStorage.getItem('user')
        if (!sessionUser) {

            if (authCode && accessToken) {
                requestUserProfile()
            }
        } 
        else {
            setUser(JSON.parse(sessionUser))
        }
    }

    function requestAuthorizationCode() {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/gmail.send'
        ]
        
        const params = {
            "client_id": process.env.REACT_APP_GOOGLE_CLIENT_ID,
            "scope": scopes.join(' '),
            "include_granted_scopes": 'true',
            "response_type": 'code',
            "access_type": 'offline',
            "redirect_uri": 'http://localhost:3000'
        }
        const query_params = Object.keys(params).map(key => key + '=' + params[key]).join('&')
        
        // redirect authorization to google
        window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + query_params
    }

    async function requestAccessToken() {

        // check authCode is available
        const authorizationCode = authCode || sessionStorage.getItem('authCode')
        if (isLoading || !authorizationCode) {
            return
        }

        setIsLoading(true)
        
        console.log('requesting token... authCode:', authorizationCode)

        const response = await axios.post('http://localhost:5000/users/token', {
            'authorization_code': authorizationCode
        }).catch(handleAxiosErrors)

        console.log('request token response:', response)

        if (response && response.status === 200) {
            sessionStorage.setItem('accessToken', response.data.access_token)
            sessionStorage.setItem('tokenExpiration', new Date(response.data.expiration))
            setAccessToken(response.data.accessToken)
        }

        setIsLoading(false)
    }

    async function requestUserProfile() {

        if (isLoading) {
            return
        }

        console.log('request user profile')

        const response = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).catch(handleAxiosErrors)

        console.log('user profile response:', response)

        if (response && response.data) {
            sessionStorage.setItem('user', JSON.stringify(response.data))
            setUser(response.data)
        }
    }

    function handleAxiosErrors(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }

    function handleLogout() {
        
        revokeAccessToken('ya29.a0AVvZVsq_PZ6VdU4lT17SiI5w9sjB4vtjEf-LmCVF3xgVIWOlUOplhppHDBj96CbJ3pA66Gc9H5IFRsJCyuMDMiYFWLCiV8Dd3BlEWAmmsC24qQi0tCeG83NjAGDYzQZX3diAOiNSL-Z1-s2UlkJaREv93n3VaCgYKASYSARISFQGbdwaINXqsIOZx91meJUUxtXDLyA0163')

        setUser(null)
        setAuthCode(null)
        setAccessToken(null)
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('authCode')
        sessionStorage.removeItem('accessToken')
        window.location.href = '/'
    }

    async function revokeAccessToken(accessToken) { 
        console.log('revoking token:', accessToken)
        const response = await axios.post('https://oauth2.googleapis.com/revoke', {
            'token': accessToken
        })

        console.log('revoke response:', response)

        if (response && response.status === 200) {
            console.log('token revoked!')
            window.location.href = '/'
        }
    }

    return(
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            
            { !user && 
                <div style={{display: "flex" }}>
                    <div className="auth-button" onClick={requestAuthorizationCode}>
                        Login - Authorization
                    </div>

                    <div className="auth-button" onClick={handleLogout}>
                        Limpar Cache
                    </div>

                </div>
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

                    <div style={{display: "flex", alignItems: "center" }}>
                        <img src={user.picture} referrerPolicy="no-referrer" />
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

export default Authorization
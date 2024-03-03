import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import '../styles/buttons/buttonLogin.css';
import '../styles/global.css';
import iconGoogle50 from '../assets/icons/iconGoogle50.png';
import photoCeoHiringpt from '../assets/images/photoCeoHiringpt.jpeg';
import Swal from 'sweetalert2' // libreria de errores
import { config } from '../config.js' // Configuracion de los endpoint
import CardExperience from '../components/Cards/Experience.js'
import { Link } from 'react-router-dom';
import AlertError from '../components/Alert/AlertError.js';




function Login(){

    const navigate = useNavigate();

    const { loginwithGoogle } = useAuth();

    const handleGoogleSignIn = async () => {
        try{
            const response = await loginwithGoogle();
            const idToken = response._tokenResponse.idToken;
            sessionStorage.setItem('id_token', idToken);

            const response_endpoint_login = await fetch( config.apiUrl + config.loginUrl, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            const response_login = await response_endpoint_login.text()
            const status_code = response_endpoint_login.status

            if (status_code == 200){
                navigate('/interviews')
            }

            if (response_login == 'user not found'){
                AlertError('Error al iniciar sesion', 'El usuario no existe, por favor registrate')
            }
            if (response_login == 'user blocked'){
                AlertError('Error al iniciar sesion','Por favor contactate con el administrador de tu empresa')
            }

        }catch(error){
            AlertError('Error al iniciar sesion','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    useEffect(() => {
        document.title = 'Iniciar sesion';
    },[]);


    return(
        <div className="full-page-centered">
            <div className="info-section">
                <CardExperience
                    imgUrl = {photoCeoHiringpt}
                    name = 'Jhon Mondragon'
                    description='"La IA automatiza procesos, optimiza resultados, genera eficiencia y mejoras radicales."'
                    title = 'CEO - Founder Hiringpt'
                />
                <CardExperience
                    imgUrl = {photoCeoHiringpt}
                    name = 'Jhon Mondragon'
                    description='"HiringPT revoluciono la selección de personal ya que evalúa, agiliza y elige con precisión mejorada."'
                    title = 'CEO - Founder Hiringpt'
                />
            </div>
            <div className="login-section shadow">
                <div className="container-login shadow">
                    <div className="container-button-login" onClick={handleGoogleSignIn}>
                        <img src={iconGoogle50}></img>
                        <p>Inicia sesion con google</p>
                    </div>
                    <Link 
                    to = '/register'
                    className="text-link mg-tp-10 fw-600">Registrarse</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
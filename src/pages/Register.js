import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import '../styles/buttons/buttonLogin.css';
import '../styles/global.css';
import iconGoogle50 from '../assets/icons/iconGoogle50.png';
import photoCeoHiringpt from '../assets/images/photoCeoHiringpt.jpeg';
import { config } from '../config.js'
import CardExperience from '../components/Cards/Experience.js'
import { Link } from 'react-router-dom';
import AlertError from '../components/Alert/AlertError.js';

export function Register(){

    
    const navigate = useNavigate();

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(false);
    const [companyName, setCompanyName] = useState('');

    const { loginwithGoogle } = useAuth();  

    const handleGoogleSignUp = async () => {

        if (companyName.trim() !== '') {
            try{
                const response = await loginwithGoogle();
                const idToken = response._tokenResponse.idToken;
    
                try{
                    const raw = {
                        "user_type": "admin",
                        "company_name": companyName,
                        "code_invitation": false
                    }
                    
                    const response_endpoint_register = await fetch( config.apiUrl + config.registerUrl, {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}`
                        },
                        body: JSON.stringify(raw)
                    });

                    if (response_endpoint_register.status == 201){
                        
                        window.location.href = '/interviews'

                    }else if (response_endpoint_register.status == 409){
                        AlertError('Error', 'Ya existe una cuenta con este correo, por favor inicia sesion')
                    }else{
                        AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
                    }
                }catch(error){
                    AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }catch(error){
                AlertError('Error', 'Lo sentimos, fallo el proceso de login')
            }
        }else {
            setError(true);
            AlertError('Error', 'Debes ingresar el nombre de tu compañia')
        }
    }

    useEffect(() => {
        document.title = 'Registrarse';
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
                    <div>
                        <h2 className="fw-800">Registrate</h2>
                        <p className="fw-600 fs-20">Tranforma el futuro de tu compañia</p>
                        <p className="fs-15">Al registrarte aceptas los <a className="text-link">terminos</a> y <a className="text-link">politicas de privacidad</a></p>
                    </div>
                    <div>
                        <input 
                        placeholder="Nombre de tu compañia" 
                        className={`bor-gray-rad mg-bt-10 with-200 txt-center block-highlight fw-900 fs-15 ${error ? 'error-border' : ''}`}
                        value = {companyName}
                        onChange={(e) => {
                            setCompanyName(e.target.value);
                            setError(false);
                        }}
                        />
                    </div>
                    <div className="container-button-login" onClick={handleGoogleSignUp}>
                        <img src={iconGoogle50}></img>
                        <p>Registrate con google</p>
                    </div>
                    <Link to="/login" className="text-link mg-tp-10 fw-600">Iniciar sesion</Link>
                </div>
            </div>
        </div>
    )
}
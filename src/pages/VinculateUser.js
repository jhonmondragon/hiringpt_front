import React, { useRef, useState, useEffect } from 'react';
import { Button, Result } from 'antd';
import { useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.js";
import { config } from '../config';
import AlertError from '../components/Alert/AlertError';
import iconGoogle50 from '../assets/icons/iconGoogle50.png';


const VinculateUser = () => {

    const { code_invitation } = useParams(); //codigo de la invitacion

    const [invitingCompany, setInvitingCompany] = useState('')
    const [showButtonRegister, setShowButtonRegister] = useState(false) // ver el boton de registrarse con google
    const [showInvitation, setShowInvitationy] = useState(false) // ver la opcion de aceptar o rechazar
    const [infoInvitation, setInfoInvitation] = useState({}) // guarda la informacion de la invitacion
    const { loginwithGoogle } = useAuth(); // llama la auth con google

    const getInfoInvitation = async () => {

        try {

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            const requestOptions = {
                method: 'GET',
                Headers: myHeaders,
            };

            const response = await fetch(
                config.apiUrl + config.get_invitation_user + '?code=' + code_invitation, requestOptions
            );
            
            if (response.status === 404){
                AlertError('Invitacion no encontrada', 'No se encontro ninguna invitacion, contacta al administrador')
            }

            if (response.ok){
                const jsonData = await response.json();

                setInfoInvitation(jsonData)

                if (jsonData.is_active === true){

                    setInvitingCompany(jsonData.company_name)

                    setShowInvitationy(true)

                }else{
                    AlertError('Invitacion expirada', 'La invitacion expiro o ya fue utilizada, por favor contacta al administrador') 
                }
            }
        }catch(e) {
            console.log(e)
            AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    //funcion para aceptar o rechazar la invitacion
    const handleNoveltyInvitation = (optionSelect) => {
        
        try{

            if (optionSelect === 'confirm') {

                console.log(infoInvitation)

                //si esta creado realiza el cambio con normalidad, si no esta creado solicita que cree la cuenta y la vincula
                if (infoInvitation.user_guest_is_created) {
                    postStatusInvitatio(optionSelect);
                }else{
                    console.log('Se debe registrar')
                    setShowInvitationy(false);
                    setShowButtonRegister(true);
                }

                //postStatusInvitatio(optionSelect);

            }else if(optionSelect === 'rejected') {

                postStatusInvitatio(optionSelect);

            }else{
                AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')    
            }

        }catch(e){
            console.log(e)
            AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    //llamado al endpoint para reportar la aceptacion o rechazo
    const postStatusInvitatio = async (status) =>{

        try{

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            const raw = JSON.stringify({
                "status": status,
                "code": code_invitation
            });

            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
            }

            const response = await fetch(
                config.apiUrl + config.novelty_invitation, requestOptions
            )

            if (response.ok){
                window.location.href = '/login'
            }else if (response.status === 404){
                AlertError('Error', 'La invitacion ya su utilizo o caduco, por favor contacta al administrador')
            }else{
                AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }


        }catch(e){
            AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    //registrarse con google
    const handleGoogleSignUp = async () => {
        try{
            const response = await loginwithGoogle();
            const idToken = response._tokenResponse.idToken;

            try{
                const raw = {
                    "user_type": "recruiter",
                    "company_name": '',
                    "code_invitation": code_invitation,
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
                    AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }else{
                    AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
                
            }catch(error){
                AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
                
            }
        }catch(error){
            AlertError('Error', 'Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
        }


    useEffect(() => {
        getInfoInvitation()
    },[]);


    return (
        <div className='center-content-column height-100vh with-100vw'>
            {showButtonRegister && (
                <div className="container-button-login" onClick={handleGoogleSignUp}>
                    <img src={iconGoogle50}></img>
                    <p>Registrate con google</p>
                </div>
            )}
            {showInvitation && (
                <Result
                    status="info"
                    title={`Te invitaron a ser parte de ${invitingCompany}`}
                    subTitle={
                        <span className='fw-700 txt-black fs-20'>
                            Si aceptas la invitación pasarás a ser parte de {invitingCompany}
                        </span>
                    }
                    extra={[
                        <Button 
                            type="primary" 
                            key="btn_accept" 
                            onClick={() => {
                                handleNoveltyInvitation('confirm');
                            }}
                            className='button_green fw-600'
                        >
                            Aceptar invitación
                        </Button>,
                        <Button 
                            type="primary"
                            key="btn_decline"
                            onClick={() => {
                                handleNoveltyInvitation('rejected');
                            }}
                            className='button_red fw-600'
                        >
                            Rechazar invitación
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
        

}

export default VinculateUser;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // metodos de authentication
import TableAnalytics from '../components/Analitics/Table.js'
import CounterInterviewResponses from '../components/Analitics/CounterInterviewResponses.js'
import { useParams } from 'react-router-dom';
import { config } from '../config.js'; // Configuracion de los endpoint
import Swal from 'sweetalert2'; // libreria de errores



const Analitics = () => {

    const { process_id } = useParams();
    const { refreshToken } = useAuth(); // metodo para refrescar el token de auth

    //Trae la informacion del proceso
    const [infoProcess, setInfoProcess] = useState({}) // informacion del proceso
    
    const AlertError = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error'
        })
    }

    const getInfoProcess = async () => {
        try{

            const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            }
            const response = await fetch(
                config.apiUrl + config.listInfoProcessUrl + process_id, requestOptions
            )

            if(response.status == 401){
                try{
                    const new_id_token = await refreshToken()
                    sessionStorage.setItem('id_token', new_id_token);
                    await getInfoProcess()
                }catch (error){
                    AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }
            const jsonData = await response.json()

            setInfoProcess(jsonData)

        }catch(e){
            AlertError('Se presento un error', 'Por favor vuelve a intentar o contacta a soporte')
        }
    }

    useEffect(() => {
        getInfoProcess()
    },[])

    return (
        <div className='flex-center-column'>
            <div
                className='flex'
            >
                <button 
                    className='fw-900 fs-20 btn-black-white height-fit-content mg-tp-10'
                    onClick={() => (
                        window.location.href = '/process'
                    )}
                >Volver</button>
                <h2 className='txt-center with-90vw'>{infoProcess.name}</h2>
            </div>
            <TableAnalytics
                processId = {process_id}
            />
            <CounterInterviewResponses
                processId = {process_id}
            />
        </div>
        
    )

}

export default Analitics
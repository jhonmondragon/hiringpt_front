import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import CardGroup from '../components/Cards/CardGroup'
import { config } from '../config.js'; // Configuracion de los endpoint
import { useAuth } from '../context/AuthContext'; 
import AlertError from '../components/Alert/AlertError.js';

const Interview =() =>{

    const { refreshToken } = useAuth();

    const [listInterviews, setListInterviews] = useState([]);
    const [interviewsFilter, setInterviewsFilter] = useState([]); // contiene las entrevistas filtradas por la barra de busqueda

    const getInterviews = async () => {
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
                config.apiUrl + config.listInterviewsUrl, requestOptions
            );
    
            if(response.status == 401){
                try{
                    const new_id_token = await refreshToken()
                    sessionStorage.setItem('id_token', new_id_token);
                    await getInterviews()
                }catch (error){
                    AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }else{
                const jsonData = await response.json();
                setListInterviews(jsonData)
                setInterviewsFilter(jsonData)
            }
            
        }catch (error) {
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    };

    useEffect(() => {
        // titulo de la pagina
        document.title = 'Admin';
        getInterviews();
    },[]);

    //modal para crear entrevista

    const [isAddingInterview, setIsAddingInterview] = useState(false);
    const [newInterviewName, setnewInterviewName] = useState('');

    const handleConfirmInterview = async () => {
        try{
            if (newInterviewName == null || newInterviewName.trim() == '') {
                AlertError('Error','Debes ingresar un nombre para la entrevista')
            }else{

                const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

                const myHeaders = new Headers;
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);
                
                const raw = JSON.stringify({
                    "name": newInterviewName
                });
                
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };
                const response = await fetch(
                    config.apiUrl + config.createInterviewUrl,
                    requestOptions
                );
                if (response.ok) {    
                    // Luego de la creación, puedes cerrar el formulario y limpiar el nombre de la nueva categoría
                    setIsAddingInterview(false);
                    setnewInterviewName('');
                    window.location.reload();
        
                }else if(response.status === 401){
                    try{
                        const new_id_token = await refreshToken()
                        sessionStorage.setItem('id_token', new_id_token);

                        await handleConfirmInterview()
                        
                    }catch (error){
                        AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                    }
                } 
                else {
                    AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }

        }catch(error){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    const handleAddInterviewClick = () => {
        setIsAddingInterview(true)
    }

    const handleCancelInterview = () => {
        setIsAddingInterview(false)
        setnewInterviewName('');
    }

    const handleFilterSearch = (evt) => {
        const interviewsFilter = listInterviews.filter(item => item.name.toLowerCase().includes(evt.target.value.toLowerCase()))
        setInterviewsFilter(interviewsFilter)
      }

    return (
        
        <div className='flex'>
            <Sidebar
                focus = 'interviews'
            />
            <div className='overflow-y height-100vh'>
                <div className='flex-center with-100-percent search-new mg-tp-20'>
                    <input
                        placeholder='Buscar'
                        className='inpu-search bor-gray-rad block-highlight mg-right-20 fs-20'
                        onChange={handleFilterSearch}
                    />
                    <div className='btn-black-white with-fit-content'>
                        <a onClick={handleAddInterviewClick}>Nueva entrevista</a>
                    </div>
                </div>
                <div className='container-cards'>
                    {interviewsFilter.map(item => (
                        <CardGroup 
                            key={item.id}
                            name={item.name}
                            id={item.id}
                            linkEdit={'/interview/'+item.id}
                            linkDelete={config.deleteInterviewUrl}
                            origin = 'interviews'
                        />
                    ))}
                </div>
            </div>
            {/* Modal para agregar nueva categoría */}
            {isAddingInterview && (
                <div className='modal'>
                    
                    <div className='modal-content center-content-column'>
                    <p>Crea una nueva entrevista</p>
                    <input
                        type='text'
                        value={newInterviewName}
                        onChange={e => setnewInterviewName(e.target.value)}
                        placeholder = 'Nombre de la entrevista'
                        className = "bor-gray-rad block-highlight fs-15"
                    />
                    <div className="mg-tp-20">
                        <button onClick={handleConfirmInterview} className="button_green mg-right-20 fw-900 fs-15">Confirmar</button>
                        <button onClick={handleCancelInterview} className="button_red fw-900 fs-15">Cancelar</button>
                    </div>
                </div>
                </div>
            )}
        </div>
        
    )
}

export default Interview;
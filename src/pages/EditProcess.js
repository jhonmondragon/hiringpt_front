import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // traer informacion del parametro
import { config } from '../config.js'; // Configuracion de los endpoint
import AlertError from '../components/Alert/AlertError.js';

const EditProcess = () => {

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    //Trae la informacion del proceso
    const [infoProcess, setInfoProcess] = useState({}) // informacion del proceso
    const [daysDuration, setDaysDuration] = useState(); // informacion de los duas de duracion
    const [messageCandidate, setNewMessageCandidate] = useState(); // Mensaje que se le mostrara al candidato
    const { id_process } = useParams();
    const [interviewsInProcess, setInterviewsInProcess] = useState([]); // Entrevistas en el proceso

    const getInfoProcess = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            }
            const response = await fetch(
                config.apiUrl + config.listInfoProcessUrl + id_process, requestOptions
            )
            const jsonData = await response.json()
            
            await getAllInterviews()

            jsonData.interviews.map(item => (
                setInterviewsInProcess(prevList => [...prevList, item.id])
            ))

            setInfoProcess(jsonData)
            setNewNameProcess(jsonData.name)
            setNewMessageCandidate(jsonData.message_candidate) // ingresa el mensaje para el candidato
            setDaysDuration(jsonData.days_duration) //setea los dias de duracion

        }catch(e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    

    //Cambios en el nombre del proceso
    const [newNameProcess, setNewNameProcess] = useState('')
    const handleNewNameProcess = (evt) => {
        setNewNameProcess(evt.target.value)
    }

    //actualizar informacion del proceso

    const updateInfoProcess = async () => {
        
        try{

            var interviewsInProcess = []

            getProcessFilter(2).map(item => {
                interviewsInProcess.push({
                    id: item.id,
                })
            })

            const raw = JSON.stringify({
                id: id_process,
                name: newNameProcess,
                details: infoProcess.details,
                message_candidate: messageCandidate,
                days_duration: daysDuration,
                interviews: interviewsInProcess
            })

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw
            }
            
            const response = await fetch(
                config.apiUrl + config.updateProcessUrl, requestOptions
            )

            if (response.ok){
                window.location.reload()
            }else{
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }
            

        }catch(e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    //traer todas las entrevistas
    const [interviews, setInterviews] = useState([])
    const getAllInterviews = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            }
            const response = await fetch(
                config.apiUrl + config.listInterviewsUrl, requestOptions
            )
            const jsonData = await response.json()

            jsonData.map(item => {
                setInterviews((prevCategory) => [...prevCategory, {
                    id: item.id,
                    name: item.name,
                    cost: item.cost,
                    list: 1
                }]);
            })

        }catch(e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //colocar entrevistas ya registradas en el drag and drop
    const setQuestionsInInterview = () => {

        interviews.map(item => {
            if(interviewsInProcess.includes(item.id)){
                item.list = 2;
            }
        })
    }

    
    //drag and drop
    const getProcessFilter = (list) => {
        
        return interviews.filter(item => item.list === list)
    }

    const startDrag = (evt, item) => {
        
        evt.dataTransfer.setData('itemID', item.id)
    }
    
    const draggingOver = (evt) => {
        evt.preventDefault();
    }

    const onDrop = (evt, list) => {

        const itemID = evt.dataTransfer.getData('itemID') //Traigo el id del elemento que fue soltado en la zona
        const item = interviews.find(item => item.id == itemID)
        item.list = list
        const newState = interviews.map(interview => {
            if(interview.id == itemID) return item;
            return interview;
        })
        setInterviews(newState)
    }

    //calcular el costo de la entrevista
    const [costProcess, setCostProcess] = useState(0)
    const calculateCost = () => {

        const total = interviews
            .filter(item => item.list == 2)
            .map(item => item.cost)
            .reduce((accumulator, value) => accumulator + value, 0)
        
        setCostProcess(total)
    }

    useEffect(() => {
        getInfoProcess()
    },[])

    //llamo a la funcion solo cuando se registre informacion
    useEffect(() => {
        setQuestionsInInterview()
        
    },[interviewsInProcess])

    useEffect(() => {
        calculateCost()
    },[interviews,interviewsInProcess])

    

    return (
        <div className="">
            <div 
                className="flex with-100vw overflow-x mg-tp-20 pd-bt-10 height-10vh"
                droppable="true"
                onDragOver={(evt => draggingOver(evt))}
                onDrop={(evt => onDrop(evt, 1))}
                >
                    {getProcessFilter(1).map((item) => (
                        <div 
                            className="mg-left-20 bor-dark-gray-rad with-fit-content max-with-200 min-with-150 center-content-column txt-center shadow"
                            key={item.id}
                            draggable onDragStart={(evt) => startDrag(evt, item)}
                            >
                            <p>{item.name}</p>
                        </div>
                    ))}
            </div>
            <div className="mg-tp-30 flex">
                <div className="flex-center-column">
                    <div className="with-20vw height-60vh center-content-column mg-left-20">
                        <input 
                            value={newNameProcess}
                            onChange={handleNewNameProcess}
                            className='fs-20 txt-center fw-700 bor-none mg-bt-20'
                            />
                        <div className="center-content-column">
                            <label>Dias disponibles para la prueba:</label>
                            <select 
                                className="bor-gray-rad shadow mg-tp-20"
                                value={daysDuration}
                                onChange={(e) => setDaysDuration(e.target.value)}
                                >
                                <option value="1">1 dia</option>
                                <option value="2">2 dia</option>
                                <option value="3">3 dia</option>
                                <option value="4">4 dia</option>
                            </select>
                        </div>
                        <textarea
                            className=' with-20vw height-20vh mg-tp-20 bor-gray-rad'
                            placeholder='Mensaje que se mostrara al candidato'
                            value={messageCandidate}
                            onChange={(e) => setNewMessageCandidate(e.target.value)}
                        />
                        
                        <p className='txt-center'>El costo total del proceso es: ${costProcess.toFixed(2)}USD</p>

                    </div>
                    <button 
                        className="mg-tp-10 button_green with-15vw fw-900 fs-20"
                        onClick={updateInfoProcess}
                        >Guardar</button>
                    <button 
                        className="mg-tp-10 button_red with-15vw fw-900 fs-20"
                        onClick={(evt) => (window.location.href = '/process')}
                        >Cancelar</button>
                    <button 
                        className="mg-tp-10 button_gray with-15vw fw-900 fs-20"
                        onClick={(evt) => (window.location.href = '/process')}
                        >Volver</button>
                </div>
                
                <div>
                    <div 
                        className="bor-dark-gray-rad with-70vw mg-left-30 height-70vh overflow-y"
                        droppable="true" 
                        onDragOver={(evt => draggingOver(evt))} 
                        onDrop={(evt => onDrop(evt, 2))}
                        >
                        <div className="with-70vw txt-center fw-700">
                            <p>Arrastra las entrevistas requeridas para el proceso</p>
                        </div>
                        <div className="flex-center-column">

                            {getProcessFilter(2).map((item) => (
                                <div 
                                    className="bor-dark-gray-rad with-50vw txt-center shadow mg-tp-20 fw-700"
                                    key= {item.id}
                                    draggable onDragStart={(evt) => startDrag(evt, item)}
                                    >
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default EditProcess;
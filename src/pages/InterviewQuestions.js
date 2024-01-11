import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../config.js'; // Configuracion de los endpoint
import { useNavigate } from 'react-router-dom';
import AlertError from '../components/Alert/AlertError.js';

const InterviewQuestions = () => {


    const [questions, setQuestions] = useState([]) // guarda informacion de todas las preguntas
    const [questionsByCategory, setQuestionsByCategory] = useState([])
    const [infoInterview, setInfoInterview] = useState();
    const [loading, setLoading] = useState(true);  // Nuevo estado para indicar si se está cargando la página
    const [questionInInterview, setQuestionInInterview] = useState([])

    const navigate = useNavigate();// manejar la navegacion en la pagina


    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    //Traer todas las categorias
    const [categorys, setCategorys] = useState([])
    
    const getCategorysQuestions = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            }

            const response = await fetch(
                config.apiUrl + config.listQuestionCategoryUrl, requestOptions
            )
            const jsonData = await response.json()

            jsonData.map(item => {
                setCategorys((prevCategory) => [...prevCategory, item.name]);
                
            })
            
        }catch{
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //Infomacion de la entrevista
    const { id_interview } = useParams();
    const [previousVersions, setPreviousVersions] = useState([])

    const getInfoInterviewFetch = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            }

            const response = await fetch(
                config.apiUrl + config.infoInterviewUrl + id_interview, requestOptions
            )
            const jsonData = await response.json()

            setInfoInterview(jsonData)
            setNewNameInterview(jsonData.name)


            jsonData.questions.map(item => (
               setQuestionInInterview(prevLista => [...prevLista, item.id])
            ))
            

        }catch{
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //llamar todas las preguntas
    const getInfoQuestionsFecth = async () =>{

        try{
            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            }

            const response = await fetch(
                config.apiUrl + config.listAllquestionsUrl, requestOptions
            )
            const jsonData = await response.json()

            jsonData.map(item =>( 
                setQuestions((prevQuestions) => [...prevQuestions,{
                    id: item.id,
                    ask: item.ask,
                    list: 1,
                    category: item.category,
                    cost: item.cost
                }])
            ))
        }catch{
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //colocar preguntas ya registradas en el drag and drop
    const setQuestionsInInterview = () => {
        questions.map(item => {
            if(questionInInterview.includes(item.id)){
                item.list = 2;
            }
        })
    }

    //Drag and drop
    const getQuestions = (list) => {
        return questionsByCategory.filter(item => item.list === list)
    }

    const startDrag = (evt, item) => {
        evt.dataTransfer.setData('itemID', item.id)
    }

    const draggingOver = (evt) => {
        evt.preventDefault();
    }

    const onDrop = (evt, list) => {
        const itemID = evt.dataTransfer.getData('itemID') //Traigo el id del elemento que fue soltado en la zona
        const item = questions.find(item => item.id == itemID)
        item.list = list
        const newState = questions.map(question => {
            if(question.id == itemID) return item;
            return question;
        })
        setQuestions(newState)
    }

    // Función que maneja el cambio en la lista desplegable
    const handleDropdownChange = (event) => {
        
        if (event.target.value == 'default'){
            setQuestionsByCategory(questions)
        }else{
            var list_question = questions.filter(item => item.category == event.target.value || item.list == 2)
            setQuestionsByCategory(list_question)
        }
    };

    //Funcion para guardar los cambios en la entrevista
    const putInterview = async () => {
        const newQuestionsInInterview = (questions.filter(item => item.list == 2))

        try{
            let allQuestionsNewInInterview = []

            newQuestionsInInterview.map(item =>(
                allQuestionsNewInInterview.push({
                    id: item.id,
                })
            ))
            
            const raw = JSON.stringify({
                interview_id: infoInterview.id,
                name: newNameInterview,
                questions: allQuestionsNewInInterview
            });

            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', `Bearer ${token}`);
            
            
            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw
            }

            const response = await fetch(
                config.apiUrl + config.updateInterviewUrl, requestOptions
            )

            const jsonData = await response.json();
            

            window.location.href = jsonData.id

        }catch (e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //Volver a la pagina anterior
    const backInterviewQuestions = () => {
        navigate('/interviews')
    }

    //Calcular el valor de la entrevista

    const [valueInterview, setValueInterview] = useState(0)

    const handleInterviewCost = () => {
        
        const total = questions
            .filter(item => item.list == 2)
            .map(item => item.cost)
            .reduce((accumulator, value) => accumulator + value, 0)
        
        setValueInterview(total)
    }

    useEffect(() => {
        handleInterviewCost()
    },[questions])


    //Guardar el nuevo nombre
    const [newNameInterview, setNewNameInterview] = useState('')
    const handleNewNameInterview = (evt) => {
        setNewNameInterview(evt.target.value)
    }

    

    //Esto funciona para que se muestren las preguntas al cargar la pagina
    useEffect(() => {     
         
        // Lógica para establecer preguntas en la entrevista
        setQuestionsInInterview();
            
        // Lógica para establecer preguntas por categoría
        setQuestionsByCategory(questions);
        handleInterviewCost()
        
    }, [questionInInterview]);

    useEffect(() => {

        const fetchData = async () => {
            await getInfoQuestionsFecth();
            getInfoInterviewFetch();
            getCategorysQuestions();
        }

        fetchData()
        
    },[])

    


    return (
        <div className='flex'>
            <div className='bg-color-grey center-content-column with-30vw height-100vh shadow'>
                <select 
                    id="dropdown" 
                    onChange={handleDropdownChange}
                    className='bor-gray-rad'
                    >
                    <option value="default">Selecciona una categoria</option>
                    {categorys.map((category) => (
                        <option key = {category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <div 
                    className='bor-dark-gray-rad with-20vw height-70vh flex-center-column mg-tp-20 bg-color-white overflow-y'
                    droppable="true"
                    onDragOver={(evt => draggingOver(evt))} 
                    onDrop={(evt => onDrop(evt, 1))}>
                    {getQuestions(1).map(item =>(
                        <div 
                            className='shadow bor-gray-rad mg-tp-10 with-15vw cursor-pointer'
                            key={item.id} 
                            draggable onDragStart={(evt) => startDrag(evt, item)}>
                                <h2 className='fs-15 txt-center'>{item.ask}</h2>
                        </div>
                    ))}
                </div>
                <div>
                    <p>El costo de esta entrevista es ${valueInterview.toFixed(2)}</p>
                </div>
                <button className='button_gray fw-900 mg-bt-20 fs-20 shadow' onClick={backInterviewQuestions}>Volver</button>
            </div>
            <div className='with-70vw height-100vh flex-center-column'>
                <input
                    value={newNameInterview}
                    className='with-50vw txt-center fw-900 fs-20 mg-tp-30 bor-dark-gray-rad'
                    onChange={handleNewNameInterview}
                />
                <p>Arrastra y suelta las preguntas que quieres realizar a tu candidato</p>
                <div 
                    className='bor-dark-gray-rad with-50vw flex-center-column height-70vh overflow-y' 
                    droppable="true" 
                    onDragOver={(evt => draggingOver(evt))} 
                    onDrop={(evt => onDrop(evt, 2))}>
                    {getQuestions(2).map(item => (
                        <div 
                            className='shadow bor-gray-rad mg-tp-10 cursor-pointer with-40vw'
                            key= {item.id}
                            draggable onDragStart={(evt) => startDrag(evt, item)}
                            >
                        <h2 className='fs-15 txt-center'>{item.ask}</h2>
                    </div>
                    ))}
                </div>
                <button className='button_green mg-tp-10 with-50vw fs-20 fw-900 shadow' onClick={putInterview}>Guardar</button>
            </div>
        </div>
    );
};

export default InterviewQuestions;

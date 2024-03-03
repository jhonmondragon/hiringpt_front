import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../config.js'; // link de endpoints
import Toggle from 'react-toggle'
import 'react-toggle/style.css';
import CardQuestion from '../components/Cards/CardQuestion.js'
import { useNavigate } from 'react-router-dom';
import AlertError from '../components/Alert/AlertError.js';


const UpdateQuestion = () => {


  const navigate = useNavigate();// manejar la navegacion en la pagina

  
  const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage
  
  const { id_category } = useParams();


  const [ask, setNewQuestionAsk] = useState('');
  const [answer, setNewQuestionAnswer] = useState('');
  const handleCreateQuestion = async () => {
    try {
        if (ask == null || ask.trim() == '') {
            AlertError('Error al guardar pregunta','Debes ingresar la pregunta')
        }
        // Headers para la solicitud POST
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ ask: ask,
              answer: answer,
              category_id: id_category,
              assistant_ai: stateAi
            }),
            redirect: 'follow',
        };

    const response = await fetch(
        config.apiUrl + config.createQuestion,
        requestOptions
    );

    // Verificar si la solicitud fue exitosa (código de estado 2xx)
    if (response.ok) {
      window.location.reload();
    } else {
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }
    } catch (error) {
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }
  };


  //Trae todas las preguntas de la categoria
  const [data_questions, setData] = useState([]);
  const getQuestions = async () => {
    try {
      // Headers de la solicitud
      const myHeaders = new Headers();
      myHeaders.append('accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };

      const response = await fetch(
        config.apiUrl + config.listQuestionsByCategory + id_category, requestOptions
      );

      const jsonData = await response.json();
      setData(jsonData);
    }
    catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };
  const backInterviewQuestions = () => {
    navigate('/category_questions')
  }

  useEffect(() => {
    getQuestions();
  }, []);


  const [stateAi, setTrueAi] = useState(true);
  const alterOn = () => {
    setTrueAi(!stateAi);
  };

  

  return (
    <div className='height-100vh pd-bt-10'>
      <div className='height-70vh flex-center-column overflow-y pd-bt-10'>
        {data_questions.map( item =>(
          <CardQuestion 
            key={item.id} 
            id_question = {item.id} 
            ask = {item.ask}
            answer = {item.answer}
            assistant_ai = {item.assistant_ai}
            />
        ))}
      </div>
      <div className='center-content-column height-30vh'>
        <input 
          className='with-80vw bor-gray-rad block-highlight fs-20 mg-bt-10'
          placeholder='Que le quieres preguntar a tu candidato?'
          value={ask}
          onChange={e => setNewQuestionAsk(e.target.value)}
        ></input>

        <textarea 
          className='with-80vw bor-gray-rad block-highlight fs-15 height-10vh mg-bt-10'
          placeholder='Cual es la respuesta que esperas'
          value={answer}
          onChange={e => setNewQuestionAnswer(e.target.value)}
        ></textarea>
        <label className='flex fw-700'>
          Ayuda de ia para el analisis
          <Toggle
            checked={stateAi}
            onChange={alterOn}
            className='mg-left-20'
          />
        </label>
        <button 
          className='button_green with-80vw mg-tp-10 fw-900 pd-10 shadow'
          onClick={handleCreateQuestion}
        >Crear pregunta</button>  
        <button 
          className='button_gray fw-900 shadow with-80vw mg-tp-10'
          onClick={backInterviewQuestions}
          >Volver</button>
      </div>
    </div>
  );
};

export default UpdateQuestion;

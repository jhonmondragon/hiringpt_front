import React, { useRef, useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import logo from "../assets/images/logo.png"
import { useParams } from 'react-router-dom';
import { config } from '../config.js'; // link de endpoints
import AlertError from '../components/Alert/AlertError.js';


const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return <video ref={videoRef} width={400} height={400} autoPlay className='bor-dark-gray-rad shadow'/>;
};

const InterviewRecord = () => {
  const [enable, setEnable] = useState(true);
  const [downloadLink, setDownloadLink] = useState(null);
  
  const [modelStart, setModelStart] = useState(true); //muestra el modal de iniciar la entrevista
  const [modelInterview, setModelInterview] = useState(false); //muestra el modal de selecciona la entrevista
  const [modelSelectInterview, setModelSelectInterview] = useState(false) // muestra el modal de la entrevista

  const [interviewSelect, setInterviewSelect] = useState(); //Guarda el id de la entrevista selecciona

  const [stopQuestion, setStopQuestion] = useState(false); //manejar visibilidad de parar pregunta
  const [nextQuestion, setNextQuestion] = useState(false); //manejar visibilidad de siguiente pregunta
  const [startInterview, setStartInterview] = useState(true); //manejar la visibilidad del boton para iniciar

  const [messageStartInterview, setMessageStartInterview] = useState('Selecciona la entrevista que quieres realizar'); //manejar la visibilidad del mensaje si tienes entrevistas pendientes o ya las termino

  //Cargar toda la informacion de la entrevista
  const { token } = useParams();

  const [infoInterviews, setInfoInterviews] = useState([])

  const getInfoInterviews = async () => {
    
    try{
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'GET',
        headers: myHeaders
      }

      const response = await fetch(
        config.apiUrl + config.infoDeploymentInterviewUrl + token, requestOptions
      )
      const jsonData = await response.json();

      jsonData.map(item => {
        setInfoInterviews(prevInfo => [...prevInfo, item])
      })

      if (jsonData.length == 0){
        setMessageStartInterview('No tienes entrevistas pendientes')
      }
    }catch(err){
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }
  }
  //Trae la informacion de la entrevista seleccionada para comenzar la prueba
  const [infoInterviewSelect, setInfoInterviewSelect] = useState(undefined)

  const handleInfoInterviewSelect = () => {
    setInfoInterviewSelect(infoInterviews.find(item => item.interview_id == interviewSelect))
  }

  //Cambio de pregunta
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const changeQuestion = (direction) => {
    const nextQuestion = currentQuestion + direction

    if (nextQuestion >= 0 && nextQuestion < infoInterviewSelect.questions.length) {
      setCurrentQuestion(nextQuestion);
    }else{
      setInterviewFinished(true)
      setNextQuestion(false)
      setStopQuestion(false)
      setTimeout(() => {
        window.location.reload();
      }, 5000)
    }

  }

  //Animacion de entrevista finalizada
  const [interviewFinished, setInterviewFinished] = useState(false)

  //envia el video de la respuesta

  const post_response = async (videoBlob) => {
    try{

      if (currentQuestion !== -1){
        const myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${token}`);

        const formdata = new FormData();

        const blob = await fetch(videoBlob).then((response) => response.blob());

        formdata.append("deployment_response_id", infoInterviewSelect.questions[currentQuestion].deployment_response_id);
        formdata.append("video", blob, "grabacion.webm");

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };
  
        const response = await fetch(
          config.apiUrl + config.postResponseInterviewUrl,
          requestOptions
        )

        const jsonData = await response.text();
      }

    }catch(err){
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }
  }

  //Trae toda la info al entrar al pagina por medio del token
  useEffect(() => {
    getInfoInterviews()
  },[])

  useEffect(() => {
    handleInfoInterviewSelect()
  },[interviewSelect])

  //mostrar pregunta solo cuando se cargue la info en infoInterviewSelect
  const [showQuestion,setShowQuestion] = useState(false);
  
  useEffect(() => {
    if (infoInterviewSelect !== undefined){
      setShowQuestion(false)
    }
  },[infoInterviewSelect])

  return (
    <div>
      {modelSelectInterview &&
        <div className='center-content-column height-100vh'>
          <div className='bor-dark-gray-rad txt-center shadow'>
            <h2>{messageStartInterview}</h2>
            {infoInterviews.map(item => (
              <h3 
                key='interview_name'
                className='bor-dark-gray-rad cursor-pointer'
                onClick={() => {
                  setModelInterview(true)
                  setModelSelectInterview(false)
                  setInterviewSelect(item.interview_id)
                }}
                >{item.interview_name}</h3>
            ))}
          </div>
        </div>
      }
      {interviewFinished &&
        <div className='center-content-column height-100vh'>
          <p className='mg-bt-10 fs-20 fw-900'>Enviando respuestas</p>
          <p className='mg-bt-40'>Espera que se recargue la pagina para presentar las entrevistas faltantes</p>
          <img src={logo} className='with-20vw logo-spin'></img>
        </div>
      }
      
      {modelStart &&
        <div className='with-100vw height-100vh center-content-column'>
          <img src={logo} className='with-20vw'></img>
          <h2>Preparate para la entrevista</h2>
          <p>Te deseamos exito en la entrevista</p>
          <button 
            className='button_green fs-20 fw-900'
            onClick={() => {
              setModelSelectInterview(true)
              setModelStart(false)
            }}
            >Iniciar</button>
        </div>
      }
      
      {modelInterview &&
      <div>
        <h2 className='txt-center'>Preparate para tu entrevista</h2>
        <p className='txt-center'>Desde Hiringpt te desamos lo mejor en tu entrevista</p>
        <div>
          <ReactMediaRecorder
            video
            blobPropertyBag={{
              type: 'video/webm',
            }}
            render={({
              previewStream,
              status,
              isAudioMuted,
              startRecording,
              stopRecording,
              mediaBlobUrl,
            }) => {
              return (
                <div className='center-content-column'>
                  <p>{status}</p>
                  {enable && <VideoPreview stream={previewStream}/>}
                  <div>
                    {startInterview && <button onClick={() => {
                      setStartInterview(false)
                      setShowQuestion(true)
                      setStopQuestion(true)
                      startRecording();
                    }}
                      
                      className='button_green mg-10 fw-900 fs-20'>Iniciar con la entrevista</button>}
                    
                    {nextQuestion && <button onClick={() => {
                      startRecording();
                      setNextQuestion(false)
                      setStopQuestion(true)
                      changeQuestion(1)
                      post_response(mediaBlobUrl)
                    }} className='button_green mg-10 fw-900 fs-20'>Siguiente pregunta</button>}
                    {stopQuestion && <button 
                      onClick={() => {
                        stopRecording();
                        setNextQuestion(true)
                        setStopQuestion(false)
                      }}
                      className='button_gray mg-10 fw-900 fs-20' >Termine la pregunta</button>}
                    <button
                      className='mg-10'
                      onClick={async () => {
                        // Esperar hasta que mediaBlobUrl esté disponible
                        while (!mediaBlobUrl) {
                          await new Promise(resolve => setTimeout(resolve, 100));
                        }
                        
                        // Utilizar mediaBlobUrl directamente para la descarga
                        setDownloadLink(mediaBlobUrl);
                        post_response(mediaBlobUrl)
                      }}
                    >
                      Toggle Streaming
                    </button>
                  </div>
                </div>
              );
            }}
          />
        </div>
        {downloadLink && (
          <div>
            <p>Descargar grabació:</p>
            <a href={downloadLink} download="grabacion.webm">
              Descargar
            </a>
          </div>
        )}
        {showQuestion && (
          <h2 className='txt-center'>{infoInterviewSelect.questions[currentQuestion].ask}</h2>
        )}
      </div>}
    </div>
  );
}

export default InterviewRecord

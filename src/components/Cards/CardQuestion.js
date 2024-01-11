import '../../styles/cards/interview.css'
import { config } from '../../config.js'; // link de endpoints
import AlertError from '../Alert/AlertError.js';

const CardQuestion =({answer,id_question, ask, assistant_ai}) =>{
    
  const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    const deleteQuestion = async () =>{
        try{
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json')
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
            }

            const response = await fetch(
                config.apiUrl + config.deleteQuestion + id_question, requestOptions
            );
            
            if (response.ok){
                window.location.reload();
            }else{
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }

        }catch{
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    return (
        <div className="bor-gray-rad with-80vw height-fit-content mg-tp-20 shadow">
            <div className="flex-row-space-between">
                <h2>{ask}</h2>
                <button 
                    className='button_red height-fit-content'
                    onClick={deleteQuestion}
                    >Eliminar</button>
            </div>
            <div className="">
                <p className='fs-15'>{answer}</p>
                {assistant_ai ? (
                    <p className='button_green with-fit-content fw-700'>Asistencia de ia</p>
                ) : (
                    null // No muestra nada cuando assistant_ai es false
                )}
                {assistant_ai == false ? (
                    <p className='button_red with-fit-content fw-700'>Sin asistencia de ia</p>
                ) : null}

            </div>
        </div>
    )
}

export default CardQuestion;
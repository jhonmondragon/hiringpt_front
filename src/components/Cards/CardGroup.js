import React, { useState, useEffect } from 'react';
import '../../styles/cards/interview.css'
import { config } from '../../config.js'; // Configuracion de los endpoint
import Swal from 'sweetalert2' // libreria de errores
import { useNavigate } from 'react-router-dom';
import AlertError from '../Alert/AlertError.js';


const CardGroup =({name, id, message, linkEdit, linkDelete, origin}) =>{
    
    const navigate = useNavigate()
    

    function alertError(title, message) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error'
        })
    }

    //Activa el modal para eliminar
    const [itemDelete, setItemDelete] = useState('');
    const [isDeleteItem, setIsDeleteItem] = useState(false); //guarda la info del elemento a eliminar
    const handleDeleteClick = () =>{
        setIsDeleteItem(true)
    }
    const handleCancelDeleteClick = () =>{
        setIsDeleteItem(false)
    }

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage
    const handleConfirmDelete = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders
            };
            const response = await fetch(
                config.apiUrl + linkDelete + id,
                requestOptions
            );
            if (response.ok) {    
                // Luego de la creación, puedes cerrar el formulario y limpiar el nombre de la nueva categoría
                setIsDeleteItem(false);
                navigate(0);
            } else {
                alertError('Error','Por favor vuelve a intentar o contacta a soporte')
            }
        }catch{
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    const handleEditClick = () => {
        // Construye la URL con el id_category y abre una nueva ventana
        const editUrl = linkEdit
        window.location.href = editUrl
    };

    //Agrega el origen de donde se llamo para personalizar la tarjeta
    useEffect(() => {
        switch(origin){
            case 'questions':
                setItemDelete('categoria, si la eliminas se borraran todas las preguntas, los despliegues realizados segiran funcionando con normalidad')
                break;
            case 'interviews':
                setItemDelete('entrevista, si la eliminas no se podra volver a enviar, los envios previamente realizados segiran con normalidad')
                break;
            default:
                break;

        }
    },[])
    return (
        <div className="card">
            <div className="card-header">
                <h2 className='max-with-200'>{name}</h2>
            </div>
            <div className="card-content">
                <p>id: {id}</p>
                <p>{message}</p>
            </div>
            <div className='with-150 min-with-150'>
                <button className='button_green mg-right-20' onClick={handleEditClick}>Editar</button>
                <button className='button_red' onClick={handleDeleteClick}>Eliminar</button>
            </div>

            {/* Modal para agregar nueva categoría */}
            {isDeleteItem && (
                <div className='modal'> 
                    <div className='modal-content center-content-column'>
                        <p className='max-with-500 txt-center'>Estas seguro que quieres eliminar esta {itemDelete}</p>
                        <div className="mg-tp-20">
                            <button className="button_reed mg-right-20 fw-900 fs-15 button_green" onClick={handleCancelDeleteClick}>Cancelar</button>
                            <button className="button_reed mg-right-20 fw-900 fs-15 button_red" onClick={handleConfirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}    

        </div>
    )
}

export default CardGroup;
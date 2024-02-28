import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // metodos de authentication
import Sidebar from '../components/Sidebar/Sidebar';
import CardGroup from '../components/Cards/CardGroup';
import { config } from '../config.js'; // Configuracion de los endpoint
import AlertError from '../components/Alert/AlertError.js';

const CategoryQuestion = () => {
    
  const [categorys, setCategorys] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categorysFilter, setCategorys_filter] = useState([]); // contiene las categorias filtradas por la barra de busqueda
  const { refreshToken } = useAuth(); // metodo para refrescar el token de auth

  const fetchData = async () => {
    try {

      const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage
      
      // Headers de la solicitud
      const myHeaders = new Headers();
      myHeaders.append('accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);
      
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      
      const response = await fetch(
        config.apiUrl + config.listQuestionCategoryUrl,
        requestOptions
      );

      if (response.status === 401){
        try{
          const new_id_token = await refreshToken()
          sessionStorage.setItem('id_token', new_id_token);
          await fetchData()
        }catch (error){
          AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
      }
      
      const jsonData = await response.json();
      setCategorys(jsonData);
      setCategorys_filter(jsonData);
    } catch (error) {
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }
  };

  useEffect(() => {
    // titulo de la pagina
    document.title = 'Admin';
    fetchData();
  }, []);


  const handleAddCategoryClick = () => {  
    setIsAddingCategory(true);
  };

  //Crear categoria de pregunta
  const handleConfirmCategory = async () => {
    try {
      if (newCategoryName == null || newCategoryName.trim() == '') {
        AlertError('Error','Debes ingresar el nombre de la categoria')
      }else{

        const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage
        
        // Headers para la solicitud POST
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);
        
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({ name: newCategoryName }),
          redirect: 'follow',
        };
        
        const response = await fetch(
          config.apiUrl + config.createQuestionCategoryUrl,
          requestOptions
        );
        // Verificar si la solicitud fue exitosa (código de estado 2xx)
        
        if (response.ok) {
          // Luego de la creación, puedes cerrar el formulario y limpiar el nombre de la nueva categoría
          setIsAddingCategory(false);
          setNewCategoryName('');
          window.location.reload();
        }else if (response.status == 401) {
          try{
            const new_id_token = await refreshToken()
            sessionStorage.setItem('id_token', new_id_token);
            await handleConfirmCategory()
          }catch (error){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
          }
        }
        else {
          AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
      }
    } 
    catch (error) {
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }
  };


  const handleFilterSearch = (evt) => {
    const categorys_filter = categorys.filter(item => item.name.toLowerCase().includes(evt.target.value.toLowerCase()))
    setCategorys_filter(categorys_filter)
  }

  const handleCancelCategory = () => {
    // En caso de cancelar, simplemente cierra el formulario y limpia el nombre de la nueva categoría
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  return (
    <div className='flex'>
      <Sidebar 
        focus = 'questions'
      />
      <div className='overflow-y height-100vh'>
        <div className='flex-center with-100-percent search-new mg-tp-20'>
          <input
            placeholder='Buscar'
            className='inpu-search bor-gray-rad block-highlight mg-right-20 fs-20'
            onChange={handleFilterSearch}
          />
          <div className='btn-black-white fw-700 flex-center-vertical'>
            <a onClick={handleAddCategoryClick}>Nueva categoria</a>
          </div>
        </div>
        <div className='container-cards'>
          {categorysFilter.map(item => (
            <CardGroup 
              key={item.id} 
              name={item.name} 
              id={item.id} 
              linkEdit={'/category_questions/questions/' + item.id}
              linkDelete = {config.deleteCategory}
              origin = 'questions'
              />
              
          ))}
        </div>
      </div>

      {/* Modal para agregar nueva categoría */}
      {isAddingCategory && (
        <div className='modal'>
            
            <div className='modal-content center-content-column'>
            <p>Crea una nueva categoria</p>
            <input
                type='text'
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder = 'Nombre de la categoria'
                className = "bor-gray-rad block-highlight fs-15"
            />
            <div className="mg-tp-20">
                <button onClick={handleConfirmCategory} className="button_green mg-right-20 fw-900 fs-15">Confirmar</button>
                <button onClick={handleCancelCategory} className="button_red fw-900 fs-15">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryQuestion;
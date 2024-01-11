
import React, { useState, useEffect } from 'react';
import { config } from '../config.js'; // link de endpoints
import { createTheme, ThemeProvider } from '@mui/material'; //tema de la tabla
import { SaveAlt, Clear, Search, FirstPage, LastPage, ChevronRight, ChevronLeft, Check } from '@mui/icons-material';
import MaterialTable from 'material-table';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../components/Sidebar/Sidebar';
import AlertError from '../components/Alert/AlertError.js';



const Users = () => {

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage
    
    //Crea todas las columnas
    const columns = [
        {
            title: 'ID',
            field: 'id',
            cellStyle: { 
                width: '5%' 
            },
            editable: 'never',
            
        },
        {
            title: 'Nombre',
            field: 'name',
            cellStyle: { 
                width: '40%'
            },
        },
        {
            title: 'Email',
            field: 'email',
            cellStyle: { 
                width: '50%' 
            },
        }
    ];

    //Trae todos los usuarios registrados en la compañia

    const [allUsers, setAllUsers] = useState([])
    const getAllUsers = async () => {
        
        try{
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            const response = await fetch(
                config.apiUrl + config.listUsersCompanyUrl, requestOptions
            );

            const jsonData = await response.json();

            if(response.ok){
                jsonData.map(item => {
                    setAllUsers(prevUser => [...prevUser, {
                        id: item.id,
                        name: item.name,
                        email: item.email,
                    }])
                })
            }

        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
        
    }

    useEffect(() => {
        getAllUsers()
    },[])

    

    const data_prueba = [{id: 1, name: 'Hola', email: 'hola@gmail.com'},
                        {id: 2, name: 'Hola', email: 'hola@gmail.com'}]

    const theme = createTheme(); // Crea un tema de Material-UI

    return(
        <div className='flex'>
            <Sidebar focus='users'/>
            <div className='with-90vw overflow-y'>
                <ThemeProvider
                    theme = {theme}
                >
                <MaterialTable
                    columns={columns}
                    data = {allUsers}
                    title='Usuarios'
                    icons={{
                        Add: AddIcon, // boton de agregar
                        Clear: Clear,
                        Delete: DeleteIcon,
                        Check: Check,
                        Search: Search,
                        FirstPage: FirstPage,
                        LastPage: LastPage,
                        NextPage: ChevronRight,
                        PreviousPage: ChevronLeft,
                        Export: () => <SaveAlt />, // Asigna el icono SaveAlt al botón de exportación
                    }}
                />
                </ThemeProvider>
            </div>
        </div>
    )
    
}

export default Users;
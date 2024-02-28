import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { createTheme, ThemeProvider } from '@mui/material';
import { SaveAlt, Clear, Search, FirstPage, LastPage, ChevronRight, ChevronLeft, Check } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { config } from '../config.js'; // link de endpoints
import Sidebar from '../components/Sidebar/Sidebar';
import AlertError from '../components/Alert/AlertError.js';

const Process = () => {

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    //define los encabezados de la tabla
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
            title: 'Nombre del proceso',
            field: 'process',
            cellStyle: { 
                width: '40%'
            },
        },
        {
            title: 'Detalles',
            field: 'details',
            cellStyle: { 
                width: '50%' 
            },
            render: rowData => rowData.details.length > 50 ? `${rowData.details.substring(0, 150)}...` : rowData.details,
            emptyValue: '',
        }
    ];


    //trae la info de todos los procesos

    const [allProcess, setAllProcess] = useState([])

    const getAllProcess = async () => {
        try{
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            const response = await fetch(
                config.apiUrl + config.listAllProcess, requestOptions
            );
            
            const jsonData = await response.json();


            if(response.ok){
                jsonData.map( item => {
                    setAllProcess(prevProcesses => [...prevProcesses, {
                        id: item.id,
                        process: item.name,
                        details: item.details
                    }]);
                })
            }

        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }


    // crea un nuevo proceso
    const createProcess = async (infoProcess) => {
        try{

            if (infoProcess.process == null || infoProcess.process.trim() == '') {
                AlertError('Error','Debes ingresar el nombre del proceso')
            }else{
                const myHeaders = new Headers;
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const raw = JSON.stringify({
                    "name": infoProcess.process,
                    "details": infoProcess.details
                });
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                };
                const response = await fetch(
                    config.apiUrl + config.createProcess,
                    requestOptions
                );
                if (response.ok) {    
                    window.location.reload();
                } 
                else {
                    AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }
        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //elimina un proceso

    const deleteProcess = async (dataProcessDelete) => {
        try{
            const myHeaders = new Headers;
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
            };
            const response = await fetch(
                config.apiUrl + config.deleteProcess + dataProcessDelete.id,
                requestOptions
            );
            if (response.ok) {    
                window.location.reload();
            } 
            else {
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }

        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }
    


    useEffect(() => {
        getAllProcess()
    },[]);

  const theme = createTheme(); // Crea un tema de Material-UI

  return (
    <div className='flex'>
      <Sidebar focus='process' />
      <div className = "with-90vw overflow-y">
        <ThemeProvider 
            theme={theme}
            >
          <MaterialTable
            columns={columns}
            data={allProcess}
            title='Procesos'
            icons={{
                Add: AddIcon, // boton de agregar
                Delete: DeleteIcon,
                Check: Check,
                Search: Search,
                ResetSearch: Clear,
                FirstPage: FirstPage,
                LastPage: LastPage,
                NextPage: ChevronRight,
                PreviousPage: ChevronLeft,
                Export: () => <SaveAlt />, // Asigna el icono SaveAlt al botón de exportación
            }}
            options={{
                minBodyHeight: '85vh',
                maxBodyHeight: '85vh',
                exportButton: true,
                search: true,
                actionsColumnIndex: -1,
                pageSizeOptions: [], // Deshabilitar la opción de cambiar el tamaño de página
                pageSize: 10, // Establecer el tamaño de página predeterminado

            }}
            actions={[
                {
                    icon: EditIcon,
                    tooltip: 'Editar',
                    onClick: (event, rowData) => window.location.href = 'process/edit/' + rowData.id
                },
                {
                    icon: AutoGraphIcon,
                    tooltip: 'Analisis',
                    onClick: (event, rowData) => window.location.href = '/process/analytics/' + rowData.id
                },
                {
                    icon: SendIcon,
                    tooltip: 'Enviar',
                    onClick: (event, rowData) => window.location.href = '/process/deployment/' + rowData.id
                }
                
            ]}
            localization={{
                header:{
                    actions: "Acciones"
                },
                pagination: {
                    labelDisplayedRows: '{from}-{to} de {count}',
                    labelRowsPerPage: 'Procesos por pagina'
                },
                toolbar:{
                    searchPlaceholder: 'Buscar'  
                },
                body: {
                    editRow: {
                        deleteText: '¿Estas seguro que quieres eliminar este proceso?. Perderas TODA la informacion', // Personaliza el mensaje aquí
                    },
                    emptyDataSourceMessage: 'No tienes procesos creados'
                }
            }}
            style={{ height: '100%'}}
            editable={{
                //editable de agregar un nuevo proceso
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        createProcess(newData)
                        resolve();
                    }, 1000)
                }),
                //editable de eliminar un proceso
                onRowDelete: dataProcessDelete =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(deleteProcess(dataProcessDelete));
                    }, 1000);
                })
            }}
            
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Process;

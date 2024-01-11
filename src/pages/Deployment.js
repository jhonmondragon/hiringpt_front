import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // traer informacion del parametro
import MaterialTable from 'material-table';
import { createTheme, ThemeProvider } from '@mui/material';
import { SaveAlt, Clear, Search, FirstPage, LastPage, ChevronRight, ChevronLeft, Check, FilterList } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { config } from '../config.js'; // link de endpoints
import * as XLSX from 'xlsx/xlsx.mjs'; // para procesar excel
import AlertError from '../components/Alert/AlertError.js';
import AlertConfirm from '../components/Alert/AlertConfirm.js';


const Deployment = () => {
    const [jsonData, setJsonData] = useState(null);
    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage
    const { id_process } = useParams(); // parametros de la url

    const handleFileUpload = (data) => {
        setJsonData(data);
    };

    //Traer la informacion de todos los candidatos
    
    const [allCandidates, setAllCandidates] = useState([]);

    const getAllCandidates = async () => {

        try{

            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            const response = await fetch(
                config.apiUrl + config.listProcessCandidatesUrl + id_process , requestOptions
            );

            const jsonData = await response.json();

            if(response.ok){
                jsonData['candidates'].map( item => {
                    
                    setAllCandidates(prevCandidates => [...prevCandidates, {
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        countProcess: item.count_process
                    }]);
                })
            }
        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    //Procesar archivo excel

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        readExcel(file);
        }
    };

    const readExcel = (file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        handleFileUpload(excelData);
        };

        reader.readAsBinaryString(file);
    };

    const combineData = async () => {
        if (jsonData) {
            
            try{
                //crea todos los datos en base al excel
                var payload = []
                for (var i = 2; i<=jsonData.length; i++){
                    payload.push({
                        name: jsonData[i-1][0],
                        email: jsonData[i-1][1],
                    })
                }

                //crea encabezados
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                //crea el body
                const raw = JSON.stringify({
                    'candidates': payload,
                    'process_id': id_process
                })

                //crea el request
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw
                };

                //trae la respuesta
                const response = await fetch(
                    config.apiUrl + config.createBulkCandidatesUrl, requestOptions
                );

                if (response.ok) {    
                    window.location.reload();
                } 
                else {
                    AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }catch(e){
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }
        }
    };

    //registrar candidato individual

    const handleNewCandidate = async (infoCandidate) => {

        try{

            const myHeaders = new Headers;
            myHeaders.set('Accept', 'application/json')
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', `Bearer ${token}`);

            const raw = JSON.stringify({
                'name': infoCandidate.name,
                'email': infoCandidate.email,
                'process_id': id_process
            })

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
            };
            const response = await fetch(
                config.apiUrl + config.createCandidateUrl,
                requestOptions
            );
            if (response.ok) {    
                window.location.reload();
            } 
            else {
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }

        }catch(e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //Eliminar candidato

    const handleDeleteCandidate = async (candidateId) =>{

        try{

            const myHeaders = new Headers;
            myHeaders.set('Accept', 'application/json')
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
            };
            const response = await fetch(
                config.apiUrl + config.deleteCandidateUrl + candidateId,
                requestOptions
            );
            if(response.ok) {    
                window.location.reload();
            }
            else{
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }
        }catch(e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    //Deployment del proceso
    const handleDeployment = async (dataDeployment) =>{
        
        var candidates = []
        
        dataDeployment.map( item => {
                candidates.push({
                    id: item.id
                })
            }  
        )

        const raw = JSON.stringify({
            process_id: id_process,
            candidates: candidates
        })

        const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        const response = await fetch(
            config.apiUrl + config.deploymentUrl, requestOptions
        );
        
        const response_messague = await response.text()

        if(response.ok){
            AlertConfirm('Envio confirmado', 'Se envio el proceso con exito')
            setTimeout(() => {
                window.location.reload();
              }, 5000)
        }
        else if(response.status === 402){
            AlertError('Error','No tienes fondos suficientes, por favor recarga tu cuenta')
        }
        else if(response.status === 409){
            AlertError('Error','Las entrevistas vinculadas deben tener minimo una pregunta')
        }
        else{
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }


    const columns = [
        {
            title: 'ID',
            field: 'id',
            cellStyle: {
                width: '5%'
            },
            editable: 'never',
            filtering: false
        },
        {
            title: 'Nombre del candidato',
            field: 'name',
            cellStyle: {
                width: '35%'
            },
        },
        {
            title: 'Email',
            field: 'email',
            cellStyle: {
                width: '35%'
            },
            emptyValue: '',
        },
        {
            title: 'Procesos Activos',
            field: 'countProcess',
            cellStyle: {
                width: '10%'
            },
            editable: 'never',
            emptyValue: '',
        }
    ];

    const theme = createTheme(); // Crea un tema de Material-UI

    

    useEffect(() => {
        // Combina los datos cuando jsonData cambia
        combineData();
    }, [jsonData]);

    useEffect(() => {
        // Trae todos los candidatos
        getAllCandidates();
    }, []);

    
    return (
        <div>
            <div className='height-10vh center-content-column mg-bt-10'>
                <label className='fw-900 fs-20 mg-bt-10'>Puedes cargar varios candidatos por medio de un Excel</label>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className='button_gray shadow fw-900'/>
            </div>
            <div className='center-content-column mg-bt-10'>
                    <button 
                        className='button_gray fw-700'
                        onClick={()=>(window.location.href = '/process')}
                        >Volver</button>
            </div>
            <div>
                <ThemeProvider theme={theme}>
                    <MaterialTable
                        className = 'txt-center'
                        columns={columns}
                        data={allCandidates}
                        title='Candidatos'
                        icons={{
                            Add: AddIcon, // boton de agregar
                            Clear: Clear,
                            Delete: DeleteIcon,
                            Filter: FilterList,
                            Check: Check,
                            Search: Search,
                            FirstPage: FirstPage,
                            LastPage: LastPage,
                            NextPage: ChevronRight,
                            PreviousPage: ChevronLeft,
                            Export: () => <SaveAlt />, // Asigna el icono SaveAlt al botón de exportación
                        }}
                        options={{
                            selection: true,
                            filtering: true,
                            search: false,
                            actionsColumnIndex: -1,
                        }}
                        localization={{
                            header:{
                                actions: "Acciones"
                            },
                            toolbar: {
                                nRowsSelected: '{0} candidatos seleccionados'
                            },
                            body: {
                                editRow: {
                                    deleteText: '¿Estas seguro que quieres eliminar este candidato?. Perderas la informacion del candidato', // Personaliza el mensaje aquí
                                },
                                emptyDataSourceMessage: 'No tienes procesos creados'
                            }
                        }}
                        actions={[
                            {
                                tooltip: 'Enviar proceso a los candidatos seleccionados',
                                icon: SendIcon,
                                onClick: (evt, data) => (handleDeployment(data))
                            },
                            {
                                icon: EditIcon,
                                tooltip: 'Editar',
                            },
                        ]}
                        editable={{
                            //editable de agregar un nuevo Candidato
                            onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve(handleNewCandidate(newData));
                                }, 1000)
                            }),
                            //editable de eliminar un proceso
                            onRowDelete: dataProcessDelete =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve(handleDeleteCandidate(dataProcessDelete.id));
                                }, 1000);
                            })
                        }}
                    />
                </ThemeProvider>
            </div>
            
        </div>
    );
};

export default Deployment;

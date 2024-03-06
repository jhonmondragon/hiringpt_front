
import React, { useState, useEffect } from 'react';
import { config } from '../config.js'; // link de endpoints
import { createTheme, ThemeProvider } from '@mui/material'; //tema de la tabla
import { SaveAlt, Clear, Search, FirstPage, LastPage, ChevronRight, ChevronLeft, Check } from '@mui/icons-material';
import { Modal, Select } from 'antd';
import MaterialTable from 'material-table';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
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
            editable: 'never',
        },
        {
            title: 'Email',
            field: 'email',
            cellStyle: { 
                width: '40%' 
            },
        },
        {
            title: 'Rol',
            field: 'role',
            cellStyle: { 
                width: '15%' 
            },
            editable: 'never',
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

                    let roleLabel = "";
                    if(item.is_owner === true){
                        roleLabel = "Propietario"
                    }
                    else if (item.user_type == "admin") {
                        roleLabel = "Administrador";
                    } else if (item.user_type == "recruiter") {
                        roleLabel = "Reclutador";
                    }

                    setAllUsers(prevUser => [...prevUser, {
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        role: roleLabel,
                        isOwner: item.is_owner
                    }])
                })
            }

        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }   
    }

    //invitar a un usuario
    const handleInvitationUser = async (infoInvitation) => {

        try{

            console.log(infoInvitation.email)
            if (infoInvitation.email == null || infoInvitation.email.trim() == '') {
                
                AlertError('Error','Debes ingresar el email del usuario')

            }else{

                const myHeaders = new Headers;
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const raw = JSON.stringify({
                    "email": infoInvitation.email
                });

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                }

                const response = await fetch(
                    config.apiUrl + config.invitationUser,
                    requestOptions
                );

                if (response.ok) {    
                    
                    console.log(response)
                    
                } 
                else {
                    AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
                }
            }
        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }

    const [isModalChangeRoleOpen, setIsModalChangeRoleOpen] = useState(false);//visibilidad del modal para cambiar de rol
    const [idUserSelect, setIdUserSelect] = useState(false);//visibilidad del modal para cambiar de rol
    const [optionSelectChangeRole, setOptionSelectChangeRole] = useState(false);//opcion seleccionada para el cambio de rol

    //llama al endpoint para cambiar rol
    const confirmChangeRole = async () => {

        try{

            const myHeaders = new Headers
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const raw = JSON.stringify({
                'user_id_change': idUserSelect,
                'user_type': optionSelectChangeRole,
            })

            const requestOptions = {
                'method': 'PUT',
                'headers': myHeaders,
                'body': raw
            }

            const response = await fetch(
                config.apiUrl + config.changeUserRole, requestOptions
            )

            if (response.ok) {
                window.location.reload();
            }else {
                AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
            }


        }catch(e){

        }

    }

    //abre el modal de cambiar de rol
    const showModalChangeRole = () => {
        setIsModalChangeRoleOpen(true);
    };
    
    //confirma el llamado al endpoint de cambiar rol y cierra el modal
    const handleChangeRoleOk = () => {
        
        confirmChangeRole()

        setIsModalChangeRoleOpen(false);
    };

    //cierra el modal si se da en el boton de cancelar
    const handleChangeRoleCancel = () => {
        setIsModalChangeRoleOpen(false);
    };




    //Eliminar un usuario de la compañia
    const [isModalDeletedUserOpen, setIsModalDeletedUserOpen] = useState(false); // maneja la visibilidad del modal para eliminar usuario

    const confirmDeleteUser = async () => {

        const myHeaders = new Headers
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);

        const raw = JSON.stringify({
            'user_delete_id': idUserSelect
        });

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw
        }

        const response = await fetch(
            config.apiUrl + config.deleteUserCompany, requestOptions
        )

        if (response.ok) {    
            window.location.reload();
        } 
        else {
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //abre el modal de eliminar el usuario
    const showModalDeletedUser = () => {
        setIsModalDeletedUserOpen(true);
    };

    //confirma el llamado al endpoint de cambiar rol y cierra el modal
    const handleDeletedUserOk = () => {
        
        confirmDeleteUser()

        setIsModalDeletedUserOpen(false);
    };

    //cierra el modal si se da en el boton de cancelar
    const handleDeletedUserCancel = () => {
        setIsModalDeletedUserOpen(false);
    };


    useEffect(() => {
        getAllUsers()
    },[])

    const theme = createTheme(); // Crea un tema de Material-UI

    return(
        <div className='flex'>
            
            <Modal 
                title="Selecciona un rol" 
                open={isModalChangeRoleOpen} 
                onOk={handleChangeRoleOk} 
                onCancel={handleChangeRoleCancel}
                okText="Cambiar rol"
                cancelText = "Cancelar"
            >
                <Select
                    defaultValue=""
                    className='with-200'
                    onChange={setOptionSelectChangeRole}
                    options={[
                        { value: 'admin', label: 'Administrador' },
                        { value: 'recruiter', label: 'Reclutador' },
                    ]}
                />
            </Modal>
            
            <Modal 
                title="Eliminar usuario" 
                open={isModalDeletedUserOpen} 
                onOk={handleDeletedUserOk} 
                onCancel={handleDeletedUserCancel}
                okText="Eliminar usuario"
                cancelText = "Cancelar"
            >
                <span className='fw-700 txt-red'>
                    ¿Estas seguro que quieres eliminar este usuario de tu compañia?
                </span>
            </Modal>
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
                        rowData => ({
                            icon: SettingsIcon,
                            tooltip: 'Cambiar rol',
                            onClick: (event, rowData) => {
                                showModalChangeRole(true);
                                setIdUserSelect(rowData.id);
                            },
                            disabled: rowData.role == 'Propietario'
                        }),
                        rowData => ({
                            icon: DeleteIcon,
                            tooltip: 'Eliminar',
                            onClick: (event, rowData) => {
                                showModalDeletedUser(true);
                                setIdUserSelect(rowData.id);
                            },
                            disabled: rowData.role == 'Propietario'
                        }),
                    ]}
                    editable={{
                        //editable de agregar un nuevo proceso
                        onRowAdd: newInvitation =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                handleInvitationUser(newInvitation)
                                resolve();
                            }, 1000)
                        }),
                    }}
                />
                </ThemeProvider>
            </div>
        </div>
    )
    
}

export default Users;
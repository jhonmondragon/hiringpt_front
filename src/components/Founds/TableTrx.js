import React, { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import { config } from '../../config'; // link de endpoints
import AlertError from '../Alert/AlertConfirm';


const TableTrx = () => {

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    const [infoDataSource, setInfoDataSource] = useState([])

    const handleListDiscounts = async () => {

        try{

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            const response = await fetch(
                config.apiUrl + config.listDiscountsUrl, requestOptions
            )

            const jsonData = await response.json();
            
            jsonData.map( item => {

                setInfoDataSource(prevData => [...prevData, {
                    key: item.id,
                    id:item.id,
                    deployment_id: item.deployment_id,
                    process: item.process,
                    question: item.question,
                    candidate: item.candidate_email,
                    value: item.value,
                    status: item.status
                }])

            })

            

        }catch(e){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }

    }
    
    const columns = [
        {
            title: 'ID Descuento',
            dataIndex: 'id',
        },
        {
            title: 'ID Despliegue',
            dataIndex: 'deployment_id',
        },
        {
            title: 'Proceso',
            dataIndex: 'process',
        },
        {
            title: 'Pregunta',
            dataIndex: 'question',
        },
        {
            title: 'Candidato',
            dataIndex: 'candidate',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (progress) => (
                <span>${progress}USD</span>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState('');


    const paginationOptions = {
        pageSize: 10, // Número de registros por página
        showSizeChanger: true, // Permitir al usuario cambiar el número de registros por página
        pageSizeOptions: ['10'], // Opciones de número de registros por página
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`, // Mostrar el rango actual y el total de registros
    };

    useEffect(() => {
        handleListDiscounts();
    },[])


    return (
        <Table
            className='with-80vw'
            columns={columns} 
            dataSource={infoDataSource} 
            pagination={paginationOptions}
        />
    )

}

export default TableTrx
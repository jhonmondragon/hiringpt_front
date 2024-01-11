import React, { useState, useRef, useEffect } from 'react';
import { config } from '../../config'; // link de endpoints
import { Space, Table, Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AlertError from '../Alert/AlertError';


const TableAnalytics = ({processId}) => {

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    //define los encabezados de la tabla


    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Buscar nombre`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, 'name')}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, 'name')}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Buscar
                        </Button>
                        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reiniciar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current.select());
                }
            },
            render: (text) => searchedColumn === 'email' ? <mark>{text}</mark> : text,
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Buscar email`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, 'name')}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, 'name')}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Buscar
                        </Button>
                        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reiniciar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current.select());
                }
            },
            render: (text) => searchedColumn === 'email' ? <mark>{text}</mark> : text,
        },
        {
            title: 'Puntuacion',
            dataIndex: 'score',
            sorter: (a, b) => a.score - b.score,
            key: 'score',
            render: (score) => (
                <span>{score}/100</span>
            )
        },
        {
            title: 'Progreso de la entrevista',
            dataIndex: 'progress',
            sorter: (a, b) => a.progress - b.progress,
            key: 'progress',
            render: (progress) => (
                <span>{progress}%</span>
            ),
        }
    ];

    //Traer la informacion del dataSource

    const [infoDataSource, setInfoDataSource] = useState([])

    const getInfoDataSource = async () => {
        try{

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            const response = await fetch(
                config.apiUrl + config.getInfoResponseProcessUrl + processId, requestOptions
            );
            
            const jsonData = await response.json();

            jsonData.map( item => {

                setInfoDataSource(prevData => [...prevData, {
                    key: item.id,
                    name: item.name,
                    email: item.email,
                    score: item.score,
                    additionalInfo: item.questions_info,
                    progress: item.progress
                }])
            })

        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    //Opcion para ver detalles   
    const expandedRowRender = (record) => {
        const innerColumns = [
            {
                title: 'Categoria',
                dataIndex: 'category',
                
            },
            {
                title: 'Pregunta',
                dataIndex: 'question',
                
            },
            {
                title: 'Respuesta',
                dataIndex: 'response',  
            },
            {
                title: 'Calificacion IA',
                dataIndex: 'ia_result',
            },
            {
                title: 'Justificacion IA',
                dataIndex: 'ia_response',
            },
            {
                title: 'Opciones',
                dataIndex: 'options',
                render: (text, record) => (
                    <div>
                        <Button type="default" onClick={() => handleViewVideo(record.url_video)}>Ver Video</Button>
                    </div>
                ),
            },
        ];

        return (
            <Table
                columns={innerColumns}
                dataSource={record.additionalInfo}
                pagination={false}
            />
        );
    };
    const expandableConfig = {
        expandedRowRender,
        rowExpandable: (record) => !!record.additionalInfo,
    };

    //ver video de la respuesta
    const handleViewVideo = (videoUrl) => {
        // Muestra el video dentro de un Modal
        Modal.info({
            title: 'Video',
            content: (
                <div>
                    <p>Aquí puedes insertar el reproductor de video.</p>
                    {/* Reproductor de video HTML5 */}
                    <video controls width="100%" height="auto">
                        <source src={videoUrl} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                    </video>
                </div>
            ),
            width: 600,
        });
    };


    const paginationOptions = {
        pageSize: 10, // Número de registros por página
        showSizeChanger: true, // Permitir al usuario cambiar el número de registros por página
        pageSizeOptions: ['10'], // Opciones de número de registros por página
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`, // Mostrar el rango actual y el total de registros
    };
    
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    
    useEffect(() => {
        getInfoDataSource();
    },[])

    return(
        <div className='with-100vw'>
            <Table 
                columns={columns} 
                dataSource={infoDataSource} 
                pagination={paginationOptions}
                expandable={expandableConfig}
                />
        </div>
    )
}

export default TableAnalytics
import React, { useState, useEffect } from 'react';
import {Statistic, Space } from 'antd';
import { config } from '../../config.js'; // link de endpoints
import AlertError from '../Alert/AlertError.js';

const CounterInterviewResponses = ({processId}) => {

    const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage

    const [percentageOfCompletion, setPercentageOfCompletion] = useState({})

    const getInfoPercents = async () => {
        try{
            const myHeaders = new Headers;
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };
            const response = await fetch(
                config.apiUrl + config.getInfoPercentStatusProcessUrl + processId,
                requestOptions
            );
            
            const jsonData = await response.json();

            setPercentageOfCompletion({
                starting: jsonData.starting,
                finished: jsonData.finished,
                expired: jsonData.expired
            })

        }catch(err){
            AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
        }
    }

    useEffect(() => {
        getInfoPercents();
    },[])

    return(
        <div className='flex-row-space-between with-90vw txt-center'>
            <Space wrap>
                <Statistic 
                    title="Preguntas Sin Responder" 
                    value={percentageOfCompletion.starting}
                    className='bor-dark-gray-rad shadow'
                />
            </Space>
            <Space wrap>
                <Statistic 
                    title="Preguntas Respondidas"
                    value={percentageOfCompletion.finished}
                    className='bor-dark-gray-rad shadow'    
                />
            </Space>
            <Space wrap>
                <Statistic 
                    title="Preguntas Expiradas"
                    value={percentageOfCompletion.expired}
                    className='bor-dark-gray-rad shadow'    
                />
            </Space>
        </div>
        
    )

}

export default CounterInterviewResponses
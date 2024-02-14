import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import { Statistic } from 'antd';
import { config } from '../../config'; // link de endpoints
import AlertError from '../Alert/AlertError';


const InfoConsumed = () => {

  const token = sessionStorage.getItem('id_token'); // Obtener el token desde sessionStorage


  //calcular los fondos disponibles
  const [totalFounds, setTotalFounds] = useState(0)
  const handleFoundsAvailable = async () => {

    try {

      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      }

      const response = await fetch(
        config.apiUrl + config.getCalculateFoundsUrl, requestOptions
      )

      const jsonData = await response.json()
      
      setTotalFounds(jsonData)

    } catch (e) {
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }

  }

  const [dicountsMonth, setDicountsMonth] = useState([])
  const handleDiscountsMonth = async () => {

    try {

      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      }

      const response = await fetch(
        config.apiUrl + config.discountsMontUrl, requestOptions
      )

      const jsonData = await response.json()

      // Define el orden deseado de los meses
      const orderOfMonths = [
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];

      const dataArray = Object.entries(jsonData);
      
      //ordenas segun la lista de orderOfMonths
      dataArray.sort((a, b) => orderOfMonths.indexOf(a[0]) - orderOfMonths.indexOf(b[0]));

      //convertir a objeto a partir de la matiz ordenada
      const sortedData = Object.fromEntries(dataArray);

      for (let key in sortedData) {
        let value = sortedData[key]
        setDicountsMonth(prevData => [...prevData, {
          month: key,
          total: value
        }])
      }
    } catch (e) {
      AlertError('Error','Se presento un error, por favor vuelve a intentar o contacta a soporte')
    }


  }

  useEffect(() =>{
    handleFoundsAvailable();
    handleDiscountsMonth();
  },[])

  return (
    <div className='flex-center-vertical'>
      <AreaChart
        width={800}
        height={400}
        data={dicountsMonth}
        margin={{
          top: 0,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="5" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="total" stroke="#585656" fill="#B6FAF5" />
      </AreaChart>

      <div className='center-content-column'>
        <div >
          <Statistic
            title="Fondos disponibles"
            value={`$ ${totalFounds.toFixed(2)} USD`}
            className='mg-right-20 fw-500'
          />
          <Statistic
            title="Fondos gastados ultimos 6 meses"
            value={200}
          />
        </div>
        <button className='button_green mg-tp-20 fw-900 fs-20 shadow'>Recargar creditos</button>
      </div>
    </div>
  )

}

export default InfoConsumed
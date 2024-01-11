import React from 'react';
import { Card } from 'antd';


const ProductSection = () => {

    const cardData = [
        {
          title: '1 - Preguntas',
          content: 'Crea todas las preguntas que quieras y ordenalas por categorías',
        },
        {
          title: '2 - Entrevistas',
          content: 'Añade las preguntas que quieras a tus entrevistas',
        },
        {
          title: ' 3 - Procesos',
          content: 'Agrega las entrevistas que quieres realizar en tu proceso',
        },
        {
            title: '4 - Envio',
            content: 'Selecciona los candidatos que quieres entrevistas y enviales el proceso',
          },
        // Agrega más tarjetas según sea necesario
    ];

    
    return(
        <div className="flex-center-column mg-bt-40 mg-tp-40">
            <h2>HIRINGPT es efectivo y facil de utilizar</h2>
            <p className='fw-600 fs-20' >Evalua a tus candidatos en 4 sencillos pasos</p>
            <div className='flex max-with-100vw overflow-x'>
                {cardData.map((card, index) => (
                <div key={index}>
                    <Card 
                        title={card.title}
                        className='txt-center with-300 height-200 mg-10 bor-gray-rad shadow'
                    >
                        <p>{card.content}</p>
                    </Card>
                </div>
                ))}
            </div>
            <p className='fw-500 fs-20 txt-center'>Cuando tus candidatos respondan las preguntas podras ver sus puntaje, sus respuestas y videoentrevistas para que elijas al mejor</p>
        </div>
    )

}

export default ProductSection
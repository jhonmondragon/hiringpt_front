import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;


const FooterLanding = () => {



    return (
        <Footer 
            style={{ textAlign: 'center', width: '100vw', backgroundColor: 'black', color: 'white' }}
        >
            <Row gutter={16} className='text-align-start'>
                <Col span={8}>
                    <ul className='list-style-none'>
                        <h3>Contactanos</h3>
                        <li className='border_select fs-15 fw-700 mg-bt-20'>Soporte tecnico</li>
                        <li className='border_select fs-15 fw-700 mg-bt-20'>Ventas</li>
                    </ul>
                </Col>
        
                
                <Col span={8}>
                    <ul className='list-style-none'>
                        <h3>Demostraciones</h3>
                        <li className='border_select fs-15 fw-700 mg-bt-20'>Onboarding personalizado</li>
                    </ul>
                </Col>
        
                
                <Col span={8}>
                    <ul className='list-style-none'>
                        <h3>Recursos</h3>
                        <li className='border_select fs-15 fw-700 mg-bt-20'>Blog</li>
                        <li className='border_select fs-15 fw-700 mg-bt-20'>Webinars</li>
                    </ul>
                </Col>
            </Row>
        </Footer>
      );

}

export default FooterLanding
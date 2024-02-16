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
                        <li className='fs-15 fw-700 mg-bt-20'><a className='txt-white' href='https://forms.gle/VnSreefcaaAixGnUA' target="_blank">Soporte Técnico</a></li>
                        <li className='fs-15 fw-700 mg-bt-20'><a className='txt-white' href='https://www.linkedin.com/company/hiringpt' target="_blank">Linkedin</a></li>
                        <li className='fs-15 fw-700 mg-bt-20'><a className='txt-white' href='https://forms.gle/KWJoSm9ZPC4sVGf5A' target="_blank">Ventas</a></li>
                    </ul>
                </Col>
                
                
                <Col span={8}>
                    <ul className='list-style-none'>
                        <h3>Demostraciones</h3>
                        <li className='fs-15 fw-700 mg-bt-20'><a className='txt-white' href='https://forms.gle/aVhQzCyFWBPQt6wq6' target="_blank">Onboarding personalizado</a></li>
                    </ul>
                </Col>
        
                
                <Col span={8}>
                    <ul className='list-style-none'>
                        <h3>Recursos</h3>
                        <li className='fs-15 fw-700 mg-bt-20'><a className='txt-white' href='https://whip-shield-807.notion.site/Webinars-5f43f8db11984854bdc5ce6fe76d9d68?pvs=4' target="_blank">Webinars</a></li>
                    </ul>
                </Col>
            </Row>
        </Footer>
      );

}

export default FooterLanding
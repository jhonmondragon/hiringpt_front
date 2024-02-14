import React from 'react';
import { Menu } from 'antd';
import logo from '../../assets/images/logo.png'


const Header = () => {

    const scrollSection = (sectionId) => {
        const section = document.getElementById(sectionId);

        if (section){
            window.scrollTo({
                behavior: 'smooth',
                top: section.offsetTop,
            });
        }
    };
    
    return(
        <div className='flex-center-vertical header-container bg-color-white shadow'>
            <img 
                    src={logo}
                    className='with-50'
                />
            <Menu 
                mode="horizontal"
                className='custom_header'
                breakpoint="lg"
                style={{ width: '50vw'}}
            >
                <p
                    onClick={()=>scrollSection('productSection')}
                    className='cursor-pointer'
                >Producto</p>
            </Menu>
            <div>
                <button 
                    className='btn-white-black fw-900 fs-20 mg-right-10'
                    onClick={() => window.location.href = '/register'}
                >Registrarse</button>
                <button 
                    className='btn-black-white fw-900 fs-20 mg-left-30'
                    onClick={() => window.location.href = '/login'}
                >Iniciar sesion</button>
            </div>
        </div> 
    )

}

export default Header
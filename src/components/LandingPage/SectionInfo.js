import RobotIa from '../../assets/images/RobotIa.png'


const MainInfo = () => {

    return(
        <div className='flex-center-vertical with-100vw'>
            <div className='with-60vw pd-left-100'>
                <h2 className='fw-800 fs-60'>Contratación Potenciada por Inteligencia Artificial</h2>
                <p className='fs-20'>Da el primer paso hacia una contratación más inteligente.</p>
                <p className='fs-20'>Descubre las ventajas de nuestra plataforma y mejora tu equipo.</p>
                <p className='fs-20 fw-900 txt-green'>$50 USD de Bienvenida</p>
                <p className='fs-20 fw-900 txt-green'>NO NECESITAS TARJETA DE CREDITO PARA PODER COMENZAR</p>
                <div className='flex-center'>
                    <button className='btn-white-black fw-900 fs-20 mg-right-10'>Registrarse</button>
                    <button className='btn-black-white fw-900 fs-20 mg-left-30'>Iniciar sesion</button>
                </div>
            </div>
            <div className='with-40vw pd-right-100'>
                <img 
                    src={RobotIa}
                    className='with-40vw'
                ></img>
            </div>
        </div>
    )
}

export default MainInfo
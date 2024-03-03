import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layeers/sidebar.css';


const Sidebar =({focus}) =>{

    const handleLogOut = () =>{
        window.location.href = '/login'
        sessionStorage.removeItem('id_token');
    }

    const validateIdToken = () =>{
        if (!sessionStorage.getItem('id_token')) {
            window.location.href = '/login'; 
        }
    }

    
    useEffect(() => {
        // Combina los datos cuando jsonData cambia
        validateIdToken();
    }, []);
    
    return (
        <div className='container-sidebar'>
            <div className='container-sidebar-options'>
                <div>
                    <h2>Hiringpt</h2>
                </div>
                <Link className={`opt-bottom ${focus === 'questions' ? 'focus-link' : ''}`} to='/category_questions'>Preguntas</Link>
                <Link className={`opt-bottom ${focus === 'interviews' ? 'focus-link' : ''}`} to='/interviews'>Entrevistas</Link>
                <Link className={`opt-bottom ${focus === 'process' ? 'focus-link' : ''}`} to='/process'>Procesos</Link>
                <Link className={`opt-bottom ${focus === 'founds' ? 'focus-link' : ''}`} to='/founds'>Fondos</Link>
                <Link className={`opt-bottom ${focus === 'users' ? 'focus-link' : ''}`} to='/users'>Usuarios</Link>
            </div>
            <div 
                className='button_red mg-bt-10 fw-700 pd-10'
                onClick={handleLogOut}
            >
                <a>Cerrar sesion</a>
            </div>
        </div>
    )
}

export default Sidebar;
import '../styles/global.css';
import '../styles/layeers/notFund.css'


function NotFound(){

    return(
        <div className='center-content-column with-100vw height-100vh'>
            <div className='card center-content-column shadow'>
                <div className='center-content-column'>
                    <h2>404</h2>
                    <p>Ups....... The page does not exist</p>
                </div>
                <div className="bor-green-rad with-fit-content">
                    <a>Go to Home</a>
                </div>
            </div>
        </div>
    )
}

export default NotFound;
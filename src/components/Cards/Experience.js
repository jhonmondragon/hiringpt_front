import '../../styles/buttons/buttonLogin.css';
import '../../styles/global.css';

function CardExperience({ imgUrl, name, title, description }) {


    return(
        <div className="experience-card">
            <div className="container-photo">
                <img src={imgUrl}></img>
            </div>
            <div className="container-text">
                <h2 className="fw-900">{name}</h2>
                <p className="fs-15">{description}</p>
                <p className="text-align-end">{title}</p>
            </div>
        </div>
    )
}

export default CardExperience
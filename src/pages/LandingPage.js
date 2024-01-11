import Header from '../components/LandingPage/Header.js'
import MainInfo from '../components/LandingPage/SectionInfo.js'
import FooterLanding from '../components/LandingPage/Footer.js'
import ProductSection from '../components/LandingPage/ProductSection.js'

const LandingPage = () => {

    return(
        <div className='flex-center-column'>
            <Header/>
            <div className='mg-tp-100 mg-bt-40'>
                <MainInfo/>
            </div>
            <div>
                <ProductSection/>
            </div>
            <FooterLanding/>
        </div> 
    )

}

export default LandingPage
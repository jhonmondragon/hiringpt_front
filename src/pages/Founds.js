import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import InfoConsumed from '../components/Founds/InfoConsumed.js'
import TableTrx from '../components/Founds/TableTrx.js'

const Founds = () => {

    return(
        <div className='flex'>
            <Sidebar
                focus = 'founds'
                className
            />
            <div className='mg-tp-30 with-90vw flex-center-column height-90vh overflow-y'>
              <InfoConsumed/>
              <TableTrx/>
            </div>
        </div>
    )
}

export default Founds
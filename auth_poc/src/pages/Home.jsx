import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AppContext from '../AppContext';

function Home() {

    const { params } = useContext(AppContext)


    const search = useLocation().search
    const searchParams = new URLSearchParams(search)
    searchParams.forEach((value, key) => {
        if (!params[key]) {
            params[key] = value
        }
    })
    
    // if (paramsArray.length > 0) {
    //     params = paramsArray
    // }
}

export default Home
import '@fontsource/inter/index.css';
import '@fontsource/poppins/index.css';
import { AppDispatch } from './store/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const App = () => {

  const dispatch: AppDispatch = useDispatch()

 
  return (
    <div className='p-32'>
      <h1 className='font-poppins text-3xl'>Hola</h1>
    </div>
  )
}

export default App
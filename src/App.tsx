import { Suspense, lazy } from 'react';
import './App.scss';

const Appointment = lazy(() => import('./pages/Apppointment'));

function App() {

  return (
    <div className="main">
      <Suspense fallback={<></>}>
        <Appointment />
      </Suspense>
    </div>
  )
}

export default App

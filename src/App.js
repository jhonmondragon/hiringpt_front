import {Routes, Route} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext';
import { Register } from './pages/Register';
import NotFound from './components/NotFound';
import Login from './pages/Login';
import Interview from './pages/Interview';
import CategoryQuestion from './pages/CategoryQuestion';
import UpdateQuestion from './pages/UpdateQuestion';
import InterviewQuestions from './pages/InterviewQuestions'
import Process from './pages/Process';
import EditProcess from './pages/EditProcess';
import Users from './pages/Users';
import InterviewRecord from './pages/RecorderInterview'
import Deployment from './pages/Deployment'
import Analytics from './pages/Analytics';
import Founds from './pages/Founds';
import LandingPage from './pages/LandingPage';
import VinculateUser from './pages/VinculateUser';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/register' element = {<Register/>} />
        <Route path='/login' element = {<Login/>} />
        <Route path='/interviews' element = {<Interview/>} />
        <Route path='/category_questions' element = {<CategoryQuestion/>} />
        <Route path='/category_questions/questions/:id_category' element = {<UpdateQuestion/>} />
        <Route path='/interview/:id_interview' element = {<InterviewQuestions/>} />
        <Route path='/process' element = {<Process/>} />
        <Route path='/users' element = {<Users/>} />
        <Route path='/process/edit/:id_process' element = {<EditProcess/>} />
        <Route path='/process/deployment/:id_process' element = {<Deployment/>} />
        <Route path='/recorder/interview/:token' element = {<InterviewRecord/>} />
        <Route path='/process/analytics/:process_id' element = {<Analytics/>} />
        <Route path='/founds' element = {<Founds/>} />
        <Route path='/vinculate/:code_invitation' element = {<VinculateUser/>} />
        <Route path='/' element = {<LandingPage/>} />
        <Route path='*' element = {<NotFound/>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
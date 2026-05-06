import logo from './logo.svg';
import './App.css';
import{BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Getproducts from './components/Getproducts'
import Addproducts from './components/Addproducts';
import Signup from './components/Signup';
import Signin from './components/Signin';
import NotFound from './components/NotFound';


function App() {
  return (
   <Router>
     <div className="App">
      <header className="App-header">
      <h1>Welcome to Sokogarden</h1>
      </header>
      {/*Below are our different routes binding the components together with the rendered cmponents*/}
      <Routes>
        <Route path = '/'element={<Getproducts />}/>
        <Route path = '/addproducts' element={<Addproducts />}/>
        <Route path = '/signup' element={<Signup />}/>
        <Route path = '/signin' element = {<Signin />}/>
        <Route path = '/*' element = {<NotFound />} />
        
      </Routes>
    </div>
   </Router>
  );
}

export default App;

import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1>Fib Calculator ver 2</h1>
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other Page</Link>
        </header>

        <div>
          <Routes>
            <Route exact path='/' element={<Fib />} />
            <Route path='/otherpage' element={<OtherPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

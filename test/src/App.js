import Log from "./components/log.component";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Log />
      </div>
    </BrowserRouter>
  );
};

export default App;

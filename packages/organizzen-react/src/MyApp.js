import HomePage from "./HomePage";
import NewEvent from "./components/NewEvent";
import NewTask from "./components/NewTask";
import "./MyApp.css";

const App = () => {
  return (
    <div>
      <HomePage />
      <div className="newButtons">
        <NewEvent />
        <NewTask />
      </div>
    </div>
  );
};

export default App;
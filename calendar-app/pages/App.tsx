import Header from "./calendar/Header";
import Content from "./calendar/MainContent";
import RightSideTrigger from "./calendar/RightSideTrigger";
import Event from "./calendar/Event";
function App() {
  return (
    <div className="App">
      <Header />
      <Content />
      <RightSideTrigger />
      <Event />
    </div>
  );
}

export default App;

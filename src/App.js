import './App.css';
import RichText from './components/richText';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function App() {
  return (
    <div className="container">
      <div className="RichText">
        <RichText/>
      </div>
    </div>
  );
}

export default App;

import { connect } from 'react-redux';
import Index from './map';
import 'bootstrap/dist/css/bootstrap.min.css';

const mapStateToProps = (state) => state;

const App = connect(
  mapStateToProps,
)(Index);

export default App;

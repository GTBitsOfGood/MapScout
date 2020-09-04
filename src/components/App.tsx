import { connect } from 'react-redux';
import Index from './map';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Store } from 'reducers/types';

const mapStateToProps = (state: Store) => state;

const App = connect(
  mapStateToProps,
)(Index);

export default App;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Index from './Index';
import 'bootstrap/dist/css/bootstrap.min.css';

const mapStateToProps = state => state;

export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const App = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Index);

export default App;

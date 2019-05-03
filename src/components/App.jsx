import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Index from './Index';

const mapStateToProps = state => (state.mainReducer);

export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const App = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Index);

export default App;

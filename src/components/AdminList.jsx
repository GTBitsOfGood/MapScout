import React, { Component } from 'react';
import { withFirebase, categories } from 'react-redux-firebase';
import {storage} from '../store';
import { render } from 'react-dom';

const INITIAL_STATE = {
    dataset: {},
    isLoading: true,
};

class AdminListBase extends Component {
  constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
  };

  async componentDidMount() {
    const { firestore, categories } = this.props;
    if (!isLoaded(categories)) {
      await firestore.get('categories');
    }
    this.setState({ isLoading: false });
  };
  
  render() {
    const { categories } = this.props;
    return(
      <div>
      {
        categories.map((item) => (
          <ul>
            <li>{ item.id }</li>
            <li>{ item.active }</li>
            <li>{ item.select_type }</li>
            <li>{ item.values }</li>
          </ul>
        ))
      }
      </div>
    );
  };
};

const AdminList = withFirebase(AdminListBase);
export { AdminList }
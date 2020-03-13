import React, { Component } from 'react';

import { withFirestore, isLoaded } from 'react-redux-firebase';

import { compose } from 'redux';

import { connect } from 'react-redux';
import { providerRoute } from './ProviderRoutes';

const INITIAL_STATE = {
  dataset: {},
};

class AdminList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categories: null,
    };
  }

  async componentDidMount() {
    const { firestore, categories } = this.props;
    if (!isLoaded(categories)) {
      console.log('ligma');
      await firestore.get('categories');
    }
    await this.setState({
      categories: this.props.categories,
    });

    this.setState({ isLoading: false });
  }

  render() {
    const { categories } = this.props;
    return (
      <div>
        { categories &&
        categories.map((item) => (
          <ul>
            <li>{ item.id }</li>
          </ul>
        ))
      }
      </div>
    );
  }
}

export default compose(withFirestore, connect((state) => ({
  categories: state.firestore.ordered.categories,
  firebase: state.firebase,
})))(AdminList);

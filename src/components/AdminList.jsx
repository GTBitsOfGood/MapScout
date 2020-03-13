import React, { Component } from 'react';
import { withFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

class AdminListBase extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const toStore = await firestore.get('categories');
    this.setState({
      categories: toStore,
    });
  }

  render() {
    const { categories } = this.state;

    return (
      <div>
        {
        this.props.categories.map((item) => (
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
  }
}

export default compose(
  withFirestore,
  connect((state) => ({
    categories: state.firestore.ordered.providers,
  })),
)(AdminListBase);

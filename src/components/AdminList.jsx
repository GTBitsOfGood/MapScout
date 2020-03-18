import React, { Component } from 'react';
import { withFirestore, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

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

  deleteItem = (item) => {
    console.log("Deleted" + item);
    const { firestore } = this.props;
    firestore.collection('categories').doc(item).delete();
    window.location.reload(false);
  }

  async componentDidMount() {
    const { firestore, categories } = this.props;
    if (!isLoaded(categories)) {
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
          <div>
          <ol>
            <li>{ item.id }</li>
            <li>{item.ok}</li>
          </ol>
          <button onClick={(e) => this.deleteItem(item.id)}>Delete</button>
          </div>
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

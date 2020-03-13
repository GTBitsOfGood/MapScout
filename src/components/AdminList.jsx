import React, { Component } from 'react';
import { withFirebase, categories } from 'react-redux-firebase';

const INITIAL_STATE = {
    dataset: {},
};

class AdminListBase extends Component {
  constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
  };

  async componentDidMount() {
    const { firestore, categories } = this.props;
    let toStore = await firestore.get('categories');
    console.log(toStore);
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
        console.log(categories)
      }
      </div>
    );
  };
};

const AdminList = withFirebase(AdminListBase);
export default AdminList;

import React from "react";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirestore } from 'react-redux-firebase';
import { Store } from "reducers/types";

function Settings({ firebase, team }) {
    return (
        <div>
            <p>{team.label}</p>
            <p>{firebase.email}</p>
        </div>
    )
}

const mapStateToProps = (state: Store) => ({
    team: state.item.team,
  });

export default compose<any>(
    withFirestore,
    connect(
      mapStateToProps,
      {},
    ),
)(Settings)

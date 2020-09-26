import React from "react";
import useSelector from "react-redux";
import { withFirebase,  useFirestoreConnect } from "react-redux-firebase";
import { settingsRoute } from "routes/pathnames";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { FaUserSecret } from "react-icons/fa";
import { firestore } from "firebase";
import { withFirestore, isEmpty } from 'react-redux-firebase';
import { useState } from "react";
import { selectItem } from '../../functions/reduxActions';
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

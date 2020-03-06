import React from 'react';
import * as firebase from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useAuth = () => useAuthState(firebase.auth());

export const ProviderCollection = () => useCollection(
  firebase.firestore().collection('providers'),
  {
    snapshotListenOptions: { includeMetadataChanges: true },
  },
);

export const CategoryCollection = () => useCollection(
  firebase.firestore().collection('category'),
  {
    snapshotListenOptions: { includeMetadataChanges: true },
  },
);

const selectedContext = React.createContext({
  selected: null,
});


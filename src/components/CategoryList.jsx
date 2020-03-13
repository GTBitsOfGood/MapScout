import { providerRoute } from './ProviderRoutes';
import {compose} from "redux";
import {withFirestore} from "react-redux-firebase";
import {connect} from "react-redux";

updateFirestore = async () => {
  this.setState({ isLoading: true });
  const item = {
    ...this.state.item,
    latitude: null,
    longitude: null,
  };
  if (this.state.item.address && this.state.item.address[0].length > 0) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${
      this.state.item.address[0].replace(/\s/g, '%20')
    }&key=${API_KEY}`);
    const responseJson = await response.json();
    if (responseJson.results.length > 0 && responseJson.results[0].geometry.location) {
      item.latitude = responseJson.results[0].geometry.location.lat;
      item.longitude = responseJson.results[0].geometry.location.lng;
    }
  }
  const { firestore } = this.props;
  await firestore.get({ collection: 'providers', where: ['id', '==', item.id] }).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      firestore.update({ collection: 'providers', doc: doc.id }, item);
    });
  });
  await this.props.firestore.get('providers');

  // Hello
};

export default compose(withFirestore, connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
})))(Index);

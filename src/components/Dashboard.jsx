import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import { withFirebase } from 'react-redux-firebase';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      this.setState({files});
      this.props.uploadCsv(files[0]);
    };
    this.state = {
      files: [],
        data: []
    };
  }

    getFirebase = async () => {
        var providers = {}
        await this.props.firebase
            .firestore()
            .collection("providers").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    providers[doc.id] = doc.data()
                    console.log(doc.id, " => ", doc.data());
                });
            });
        this.setState({data: providers})
        console.log(this.state.data)

    }
    componentDidMount(){
        this.getFirebase();
    }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag and drop some files here, or click to select files</p>
            </div>

            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
              <section>
                  <ul>
                      {Object.keys(this.state.data).map((key, value) => {
                          return <li>{this.state.data[key]['buildingNum']}</li>;
                      })}
                  </ul>
              </section>
          </section>

        )}
      </Dropzone>

    );
  }
}

export default withFirebase(Dashboard);

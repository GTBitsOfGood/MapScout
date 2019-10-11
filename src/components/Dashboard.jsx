import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import { withFirebase } from 'react-redux-firebase';
import ReactTable from 'react-table'
import 'react-table/react-table.css'


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
        var providers = []
        await this.props.firebase
            .firestore()
            .collection("providers").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    var dataMap = {}
                    dataMap = doc.data()
                    dataMap['provider'] = doc.id
                    var keys = Object.keys(dataMap)
                    for(const key of keys) {
                        if (dataMap[key].constructor === Array) {
                            var arrData = dataMap[key]
                            dataMap[key] = dataMap[key].join(', ')
                        }
                    }
                    providers.push(dataMap)
                });
            });
        this.setState({data: providers})

    }
    componentDidMount(){
        this.getFirebase();
    }

  render() {
      const data = this.state.data

      const columns = [{
          Header: 'Providers',
          accessor: 'provider',
      }, {
              Header: 'Address',
              accessor: 'address',
          },{
          Header: 'Ages',
          accessor: 'ages',
      },
      ]
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
        <div>
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
          </section>

        )}
      </Dropzone>
            <section className="container">
                <ReactTable
                    data={data}
                    columns={columns}
                />
            </section>
        </div>

    )
  }
}

export default withFirebase(Dashboard);

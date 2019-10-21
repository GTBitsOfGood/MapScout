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

        this.deleteEntry = async (document) => {
            await this.props.firebase
                .firestore()
                .collection("providers").doc(document).delete().then(function() {
                alert("Successfully deleted " + document + "!");
            });
            this.setState({providers: this.state.providers.filter(entry => entry['provider'] != document)});
        };

        this.addEntry = async () => {
            await this.props.firebase
                .firestore()
                .collection("providers").doc(this.state.provider).set({
                    address: this.state.address,
                    ages: this.state.ages,
                    buildingNum: this.state.buildingNum,
                    childcare: this.state.childcare,
                    epic: this.state.epic,
                    hours: this.state.hours,
                    insurance: this.state.insurance,
                    languages: this.state.languages,
                    notes: this.state.notes,
                    phoneNum: this.state.phoneNum,
                    serviceType: this.state.serviceType,
                    specializations: this.state.specializations,
                    therapyTypes: this.state.therapyTypes,
                    website: this.state.website,
                    weekendHours: this.state.weekendHours
                }).then(function() {
                alert("Successfully added provider!");
            });
            //this.setState({providers: [...this.state.providers, this.state.provider]});
            this.getFirebase()
        };

        this.state = {
            files: [],
            providers: [],
            provider: "",
            address: "",
            ages: "",
            buildingNum: "",
            childcare: "",
            epic: "",
            hours: "",
            insurance: "",
            languages: "",
            notes: "",
            phoneNum: "",
            serviceType: "",
            specializations: "",
            therapyTypes: "",
            website: "",
            weekendHours: ""
        };
    }

    getFirebase = async () => {
        var providers = [];
        await this.props.firebase
            .firestore()
            .collection("providers").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    var dataMap = {};
                    dataMap = doc.data();
                    dataMap['provider'] = doc.id;
                    var keys = Object.keys(dataMap);
                    for(const key of keys) {
                        if (dataMap[key].constructor === Array) {
                            var arrData = dataMap[key];
                            dataMap[key] = dataMap[key].join(', ')
                        }
                    }
                    providers.push(dataMap)
                });
            });
        this.setState({providers: providers})

    };

    componentDidMount(){
        this.getFirebase();
    }

    handleChange = (event) => {
        const name = event.target.name;
        const val = event.target.value;
        this.setState({
            [name]:val
        })
        // console.log(name + " " + val);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.addEntry();
        document.getElementById("add-provider-form").reset();
    }

    render() {
        const data = this.state.providers;

        const columns = [

            {
                Header: 'Providers',
                accessor: 'provider',
            }, {
                Header: 'Address',
                accessor: 'address',
            }, {
                Header: 'Ages',
                accessor: 'ages',
            },{
                Header: 'Delete Entry',
                accessor: 'provider',
                Cell: ({value}) => (<button onClick={() => this.deleteEntry(value)}>Delete Entry</button>)
            }];
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
                            <form id="add-provider-form" onSubmit={this.handleSubmit}>
                                <input type="text" name="provider" placeholder="Provider" onChange={this.handleChange}/>
                                <input type="text" name="address" placeholder="Address" onChange={this.handleChange}/>
                                <input type="text" name="ages" placeholder="Ages" onChange={this.handleChange}/>
                                <input type="text" name="buildingNum" placeholder="Building Number" onChange={this.handleChange}/>
                                <input type="text" name="childcare" placeholder="Childcare" onChange={this.handleChange}/>
                                <input type="text" name="epic" placeholder="Epic" onChange={this.handleChange}/>
                                <input type="text" name="hours" placeholder="Hours" onChange={this.handleChange}/>
                                <input type="text" name="insurance" placeholder="Insurance" onChange={this.handleChange}/>
                                <input type="text" name="languages" placeholder="Languages" onChange={this.handleChange}/>
                                <input type="text" name="notes" placeholder="Notes" onChange={this.handleChange}/>
                                <input type="text" name="phoneNum" placeholder="Phone Number" onChange={this.handleChange}/>
                                <input type="text" name="serviceType" placeholder="Service Type" onChange={this.handleChange}/>
                                <input type="text" name="specializations" placeholder="Specializations" onChange={this.handleChange}/>
                                <input type="text" name="therapyTypes" placeholder="Therapy Types" onChange={this.handleChange}/>
                                <input type="text" name="website" placeholder="Website" onChange={this.handleChange}/>
                                <input type="text" name="weekendHours" placeholder="Weekend Hours" onChange={this.handleChange}/>
                                <input type="submit" value="Add Provider" />
                            </form>
                            <aside>
                                <h4>Files</h4>
                                <ul>{files}</ul>
                            </aside>
                        </section>

                    )}
                </Dropzone>
                <div>
                
                </div>
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

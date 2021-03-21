import React, {useState} from 'react';
import Dropzone from 'react-dropzone';
import Button from 'react-bootstrap/Button';

const ImageModal = (props) => {
    const [uploaded, setUploaded] = useState(false);
    const handleDrop = () => {
        console.log("hello")
        setUploaded(true)
    }
    return(<div>
        {!uploaded && 
        (<Dropzone accept="image/*" onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag'n'drop files, or click to select files</p>
            </div>
            )}
        </Dropzone>)
        }
        {uploaded && (
            <div className="imageModalSave">
                <Button className="cancelButton btn btn-danger" onClick={() => setUploaded(false)}>Cancel</Button>
                <Button className="saveButton btn btn-success">Save</Button>
            </div>
        )
        }
        </div>);
}

export default ImageModal;
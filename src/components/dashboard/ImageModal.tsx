import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Button from "react-bootstrap/Button";

const ImageModal = (props) => {
    const [uploaded, setUploaded] = useState(false);
    const [image, setImage] = useState(null);

    const handleDrop = (img) => {
        setImage(img[0]);
        setUploaded(true);
    };

    return (
        <div>
            {!uploaded && (
                <Dropzone accept="image/*" onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <p>Drag'n'drop files, or click to select files</p>
                        </div>
                    )}
                </Dropzone>
            )}
            {uploaded && (
                <div className="imageModalSave">
                    <div>
                        <img
                            src={URL.createObjectURL(image)}
                            className="image-upload"
                            alt="description"
                        />
                    </div>
                    <Button
                        className="cancelButton btn btn-danger"
                        onClick={() => setUploaded(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="saveButton btn btn-success"
                        onClick={() => props.handleSuccess(image)}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ImageModal;

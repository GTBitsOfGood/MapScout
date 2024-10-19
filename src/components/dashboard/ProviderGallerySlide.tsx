import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Dropzone from "react-dropzone";

export default function ProviderGallerySlide({
    title,
    description,
    imgLink, // Opens use of imgLink in slide for editing maybe?
    index,
    handleSlideDataChange,
    handleDelete,
    handleAdd,
    handleUpload,
}) {
    return (
        <div>
            <Form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    paddingBottom: "16px",
                }}
            >
                <Form.Text
                    style={{
                        color: "#333",
                        fontSize: "1rem",
                        fontWeight: "bold",
                    }}
                >{`Slide ${index + 1}`}</Form.Text>
                <Form.Group style={{ margin: "0px", maxWidth: "50%" }}>
                    <Form.Label>
                        Title <span style={{ color: "#EB5757" }}>*</span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="ex. Sandwiches and Smiles on a Sunday"
                        value={title}
                        onChange={(e) =>
                            handleSlideDataChange(index, "title", e)
                        }
                        style={{ borderColor: "#D9D9D9" }}
                        required
                    />
                </Form.Group>
                <Form.Group style={{ margin: "0px" }}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="ex. Last weekend, we prepared 100 sandwiches!"
                        value={description}
                        onChange={(e) =>
                            handleSlideDataChange(index, "description", e)
                        }
                        style={{ borderColor: "#D9D9D9" }}
                    />
                </Form.Group>
                <Form.Group style={{ margin: "0px", maxWidth: "75%" }}>
                    <Form.Label>Upload file</Form.Label>
                    <ImageModal handleSuccess={handleUpload} index={index} />
                </Form.Group>
            </Form>
            <div
                style={{
                    marginBottom: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        onClick={() => handleDelete(index)}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            color: "#4F4F4F",
                        }}
                    >
                        Delete
                    </Button>
                </div>
                <Button
                    onClick={() => handleAdd(index)}
                    style={{
                        backgroundColor: "white",
                        color: "#226DFF",
                        fontWeight: "500",
                        letterSpacing: "-0.176px",
                        lineHeight: "150%",
                        fontSize: "1rem",
                        padding: "8px",
                        border: "border: 1px solid #226DFF",
                        width: "fit-content",
                    }}
                >
                    + Add slide
                </Button>
            </div>
        </div>
    );
}

const ImageModal = ({ handleSuccess, index }) => {
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
                        <div
                            {...getRootProps({ className: "dropzone" })}
                            style={{
                                backgroundColor: "white",
                                borderStyle: "dashed",
                                borderRadius: "15px",
                            }}
                        >
                            <input {...getInputProps()} />
                            <p
                                style={{
                                    fontSize: "1.25rem",
                                    color: "#333",
                                }}
                            >
                                Drop your image here, or{" "}
                                <span style={{ color: "#226DFF" }}>browse</span>
                            </p>
                            <p>Supports JPG, JPEG2000, PNG</p>
                        </div>
                    )}
                </Dropzone>
            )}
            {uploaded && (
                <div className="imageModalSave">
                    <div style={{ width: "100%" }}>
                        <img
                            src={URL.createObjectURL(image)}
                            className="image-upload"
                            alt="description"
                            style={{
                                width: "75%",
                                height: "auto",
                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                            }}
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
                        onClick={() => {
                            handleSuccess(image, index);
                            setUploaded(false);
                        }}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
};

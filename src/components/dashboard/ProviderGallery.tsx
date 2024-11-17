import React, { useState, useEffect, Provider } from "react";
import ProviderGallerySlide from "./ProviderGallerySlide";
import { storage } from "../../store";
import { Button } from "react-bootstrap";

interface GallerySlide {
    title: string;
    description: string;
    imgLink: string;
}

interface GalleryState {
    slidesArray: GallerySlide[];
}

export default function ProviderGallery({
    galleryState,
    setGalleryState,
    deleteComponent,
}: {
    galleryState: GalleryState;
    setGalleryState: (newState: GalleryState) => void;
    deleteComponent: () => void;
}) {
    const { slidesArray: slides } = galleryState;

    const setSlides = (newSlides) => {
        setGalleryState({ ...galleryState, slidesArray: newSlides });
    };

    const defaultSlide: GallerySlide = {
        title: "",
        description: "",
        imgLink: "",
    };

    const handleSlideDataChange = (
        index: number,
        field: keyof GallerySlide,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newSlides = slides.map((slide, i) =>
            i === index ? { ...slide, [field]: e.target.value } : slide
        );
        setSlides(newSlides);
    };

    const handleDelete = (index: number) => {
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
    };

    const handleAdd = (index: number) => {
        const newSlides = [...slides];
        const newSlide = { ...defaultSlide };

        if (index === newSlides.length - 1) {
            newSlides.push(newSlide);
        } else {
            newSlides.splice(index + 1, 0, newSlide);
        }
        setSlides(newSlides);
    };

    const handleUpload = async (file, index: number) => {
        const filename = file.name;
        const fileRef = storage.ref("images").child(filename);

        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();

        const newSlides = slides.map((slide, i) =>
            i === index ? { ...slide, imgLink: url } : slide
        );
        setSlides(newSlides);
    };

    const renderSlides = () => {
        return slides.map((slide, i) => (
            <ProviderGallerySlide
                {...slide}
                index={i}
                key={i}
                handleSlideDataChange={handleSlideDataChange}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
                handleUpload={handleUpload}
            />
        ));
    };

    return (
        <div
            style={{
                width: "100%",
                margin: "0px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            {renderSlides()}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    onClick={() => handleAdd(slides.length - 1)}
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
                <button
                    type="button"
                    id="delete"
                    style={{
                        color: "red",
                        border: "1px solid red",
                        padding: "5px",
                        borderRadius: "4px",
                    }}
                    onClick={deleteComponent}
                >
                    Delete Component
                </button>
            </div>
        </div>
    );
}

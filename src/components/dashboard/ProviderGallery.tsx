import React, { useState } from "react";
import ProviderGallerySlide from "./ProviderGallerySlide";
import { storage } from "../../store";

interface GallerySlide {
    title: string;
    description: string;
    imgLink: string;
}

export default function ProviderGallery({
    slidesArray,
}: {
    slidesArray: GallerySlide[];
}) {
    const [slides, setSlides] = useState(slidesArray);

    const handleSlideDataChange = (
        index: number,
        field: keyof GallerySlide,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let newSlides = [...slides];
        newSlides[index][field] = e.target.value;
        setSlides(newSlides);
    };

    const handleDelete = (index: number) => {
        if (slides.length != 1) {
            // min 1 slide present
            let newSlides = [...slides];
            newSlides.splice(index, 1);
            setSlides(newSlides);
        }
    };

    const handleAdd = (index: number) => {
        const defaultSlide = {
            title: "",
            description: "",
            imgLink: "",
        };
        let newSlides = [...slides];

        if (index === newSlides.length - 1) {
            newSlides.push(defaultSlide);
        } else {
            newSlides.splice(index + 1, 0, defaultSlide);
        }
        setSlides(newSlides);
    };

    const handleUpload = async (file, index) => {
        const filename = file.name;
        await storage.ref("images").child(filename).put(file);
        let newSlides = [...slides];
        await storage
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then((url) => {
                newSlides[index].imgLink = url;
                setSlides(newSlides);
            });
    };

    return (
        <div style={{ width: "100%", margin: "0px" }}>
            <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify(slides, null, 2)}</pre>
            </div>
            {slides.map((slide, i) => {
                return (
                    <ProviderGallerySlide
                        {...slide}
                        index={i}
                        key={i}
                        handleSlideDataChange={handleSlideDataChange}
                        handleDelete={handleDelete}
                        handleAdd={handleAdd}
                        handleUpload={handleUpload}
                    />
                );
            })}
        </div>
    );
}

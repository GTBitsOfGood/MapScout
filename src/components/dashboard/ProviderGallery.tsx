import React, { useState, useEffect } from "react";
import ProviderGallerySlide from "./ProviderGallerySlide";
import { storage } from "../../store";

interface GallerySlide {
    title: string;
    description: string;
    imgLink: string;
}

export default function ProviderGallery({
    slidesArray = [],
}: {
    slidesArray?: GallerySlide[];
}) {
    const [slides, setSlides] = useState<GallerySlide[]>(slidesArray);

    const defaultSlide: GallerySlide = {
        title: "",
        description: "",
        imgLink: "",
    };

    useEffect(() => {
        if (!slides || slides.length === 0) {
            setSlides([{ ...defaultSlide }]);
        }
    }, [slides]);

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
        if (slides.length > 1) {
            const newSlides = slides.filter((_, i) => i !== index);
            setSlides(newSlides);
        }
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
        <div style={{ width: "100%", margin: "0px" }}>
            {/*TO BE DELETED */}
            <div>
                <h4>Current Data:</h4>
                <pre>{JSON.stringify(slides, null, 2)}</pre>
            </div>

            {renderSlides()}
        </div>
    );
}

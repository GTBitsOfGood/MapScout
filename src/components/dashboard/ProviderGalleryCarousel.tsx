import React, { useState } from "react";

interface GallerySlide {
    title: string;
    description: string;
    imgLink: string;
}

export default function ProviderGalleryCarousel({
    slidesArray,
}: {
    slidesArray: GallerySlide[];
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slidesArray.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slidesArray.length - 1 ? 0 : prevIndex + 1
        );
    };

    const isActive = (index: number) => currentIndex === index;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ display: "flex", gap: "32px" }}>
                <button
                    onClick={goToPrevious}
                    style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontFamily: "Fabric External MDL2 Assets",
                        color: "#06C",
                    }}
                >
                    {`<`}
                </button>

                {/* Card */}
                <div
                    style={{
                        display: "flex",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        width: "568px",
                        height: "368px",
                        boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.25)",
                        overflow: "hidden",
                    }}
                >
                    {/*Left-side */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                        }}
                    >
                        {/* Card Title */}
                        <div
                            style={{
                                width: "100%",
                                height: "35%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "32px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "1.5rem",
                                    color: "#333",
                                    width: "100%",
                                }}
                            >
                                {slidesArray[currentIndex].title}
                            </h2>
                        </div>

                        {/* Card Description */}
                        <div
                            style={{
                                overflowY: "auto",
                                height: "50%,",
                                maxHeight: "190px",
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    color: "rgba(148, 142, 142, 0.90)",
                                    fontWeight: "300",
                                }}
                            >
                                {slidesArray[currentIndex].description}
                            </p>
                        </div>
                    </div>
                    {/*Right-side*/}
                    <div
                        style={{
                            display: "flex",
                            overflow: "hidden",
                            height: "100%",
                            width: "50%",
                        }}
                    >
                        <img
                            src={slidesArray[currentIndex].imgLink}
                            alt={slidesArray[currentIndex].title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </div>
                <button
                    onClick={goToNext}
                    style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontFamily: "Fabric External MDL2 Assets",
                        color: "#06C",
                    }}
                >
                    {`>`}
                </button>
            </div>

            {/* bubbles */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "32px",
                }}
            >
                {slidesArray.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: isActive(index) ? "30px" : "10px",
                            height: "10px",
                            borderRadius: isActive(index) ? "15px" : "50%",
                            backgroundColor: isActive(index)
                                ? "#0A1D7C"
                                : "#115EA333",
                            transition: "width 0.3s, height 0.3s",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}

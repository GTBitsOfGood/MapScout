import React, { useState, useEffect } from "react";

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
                width: isMobile ? "100%" : "auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: isMobile ? "8px" : "32px",
                    flexDirection: isMobile ? "column" : "row",
                    width: isMobile ? "90%" : "auto",
                }}
            >
                <button
                    onClick={goToPrevious}
                    style={{
                        cursor: "pointer",
                        fontSize: isMobile ? "18px" : "24px",
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontFamily: "Fabric External MDL2 Assets",
                        color: "#06C",
                    }}
                >
                    {`<`}
                </button>

                <div
                    style={{
                        display: "flex",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        width: isMobile ? "100%" : "568px",
                        height: isMobile ? "auto" : "368px",
                        boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.25)",
                        overflow: "hidden",
                        flexDirection: isMobile ? "column" : "row",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            padding: isMobile ? "8px" : "16px",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "35%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: isMobile ? "8px" : "32px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                                    color: "#333",
                                    width: "100%",
                                    textAlign: isMobile ? "center" : "left",
                                }}
                            >
                                {slidesArray[currentIndex].title}
                            </h2>
                        </div>

                        <div
                            style={{
                                overflowY: "auto",
                                height: "auto",
                                maxHeight: isMobile ? "120px" : "190px",
                                padding: isMobile ? "4px" : "0",
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    color: "rgba(148, 142, 142, 0.90)",
                                    fontWeight: "300",
                                    fontSize: isMobile ? "0.9rem" : "1rem",
                                    textAlign: isMobile ? "center" : "left",
                                }}
                            >
                                {slidesArray[currentIndex].description}
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            overflow: "hidden",
                            height: isMobile ? "200px" : "100%",
                            width: "100%",
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
                        fontSize: isMobile ? "18px" : "24px",
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

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: isMobile ? "16px" : "32px",
                }}
            >
                {slidesArray.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: isActive(index) ? "20px" : "10px",
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

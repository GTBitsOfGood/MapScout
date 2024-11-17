import React, { useState, useEffect } from "react";

interface DirectoryItem {
    name: string;
    image: string;
    description: string;
    details: string;
}

const DirectoryCard = ({ directoryItem }: { directoryItem: DirectoryItem }) => {
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

    return (
        <div
            style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            
            <div
                style={{
                    padding: isMobile ? "8px" : "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                }}
            >
                <div
                    style={{
                        fontWeight: "600",
                        fontSize: isMobile ? "16px" : "20px",
                        color: "#226DFF",
                        marginBottom: "8px",
                    }}
                >
                    {directoryItem.name}
                </div>
                <div
                    style={{
                        fontWeight: "500",
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#333333",
                        marginBottom: "8px",
                    }}
                >
                    {directoryItem.description}
                </div>
                <div
                    style={{
                        fontWeight: "500",
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#226DFF",
                    }}
                >
                    {directoryItem.details}
                </div>
            </div>
            <img
                style={{
                    width: isMobile ? "100%" : "150px",
                    height: isMobile ? "auto" : "150px",
                    objectFit: "cover",
                }}
                src={directoryItem.image}
                alt={directoryItem.name}
            />
        </div>
    );
};

const Directory = ({ directoryItems }: { directoryItems: DirectoryItem[] }) => {
    const isTwoColumn = directoryItems.length > 3;
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

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: isMobile
                    ? "1fr"
                    : isTwoColumn
                    ? "repeat(2, 1fr)"
                    : "1fr",
                gap: "16px",
            }}
        >
            {directoryItems.map((directoryItem, i) => (
                <DirectoryCard key={i} directoryItem={directoryItem} />
            ))}
        </div>
    );
};

export default Directory;

import React, { useEffect, useRef, useState } from "react";

import { DirectoryItem } from "./DirectoryForm";

import styles from "./Directory.module.css";

const DirectoryCard = ({ directoryItem }: { directoryItem: DirectoryItem }) => {
    return (
        <div className={styles.directoryCard}>
            <img
                className={styles.directoryImage}
                src={directoryItem.image}
                alt={directoryItem.name}
            ></img>
            <div className={styles.directoryInfo}>
                <div
                    style={{
                        fontWeight: "600",
                        fontSize: "20px",
                        color: "#226DFF",
                    }}
                >
                    {directoryItem.name}
                </div>
                <div
                    style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        color: "#333333",
                    }}
                >
                    {directoryItem.description}
                </div>
                <div
                    style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        color: "#226DFF",
                    }}
                >
                    {directoryItem.details}
                </div>
            </div>
        </div>
    );
};

const Directory = ({ directoryItems }: { directoryItems: DirectoryItem[] }) => {
    const isTwoColumn = directoryItems.length > 3;
    return (
        <div
            className={`${styles.directoryGrid} ${
                isTwoColumn ? styles.twoColumn : styles.oneColumn
            }`}
        >
            {directoryItems.map((directoryItem, i) => {
                return (
                    <DirectoryCard
                        key={i}
                        directoryItem={directoryItem}
                    ></DirectoryCard>
                );
            })}
        </div>
    );
};

export default Directory;

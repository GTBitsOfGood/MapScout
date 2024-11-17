import React from "react";
interface EmbedState {
    embedLink: string;
    title: string;
}

const EmbedForm = ({
    embedState,
    setEmbedState,
    deleteComponent,
}: {
    embedState: EmbedState;
    setEmbedState: (newState: EmbedState) => void;
    deleteComponent: () => void;
}) => {
    const { embedLink, title } = embedState;

    const setEmbedLink = (newEmbedLink) => {
        setEmbedState({ ...embedState, embedLink: newEmbedLink });
    };
    const setTitle = (newTitle) => {
        setEmbedState({ ...embedState, title: newTitle });
    };

    return (
        <div style={styles.formContainer}>
            <div style={styles.formGroup}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Embed Link *</label>
                <textarea
                    placeholder="ex. <iframe>...</iframe>"
                    value={embedLink}
                    onChange={(e) => setEmbedLink(e.target.value)}
                    style={styles.textarea}
                />
            </div>

            <button type="button" style={styles.deleteLabel} onClick={deleteComponent}>
                Delete Component
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    formContainer: {
        width: "100%",
        maxWidth: "800px",
        height: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    header: {
        fontSize: "18px",
        marginBottom: "10px",
        color: "#226DFF",
    },
    formGroup: {
        marginBottom: "15px",
    },
    input: {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    textarea: {
        width: "100%",
        padding: "8px",
        fontSize: "14px",
        height: "60px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    info: {
        fontSize: "12px",
        color: "#F0F4FA",
        marginBottom: "15px",
    },
    dimensionsContainer: {
        display: "flex",
        justifyContent: "flex-start",
        gap: "20px",
        marginBottom: "15px",
    },
    dimensionGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    dimensionInput: {
        width: "80px",
        padding: "6px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        textAlign: "center",
        marginTop: "5px",
    },
    deleteLabel: {
        fontWeight: "500",
        cursor: "pointer",
        alignSelf: "end",
        padding: "5px",
        background: "transparent",
        borderRadius: "4px",
        border: "1px solid red",
        color: "red",
    },
};

export default EmbedForm;

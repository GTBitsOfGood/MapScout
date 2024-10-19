import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { withFirestore } from "react-redux-firebase";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { Link } from "react-router-dom";
import ProviderInfo from "../subcomponents/ProviderInfo";
import { formRoute } from "../../routes/pathnames";
import ProviderGalleryCarousel from "./ProviderGalleryCarousel";

// updateFirestore = async () => {
//     //Change 'ages' to the specific parameter to update
//     await this.props.firestore.update({collection: 'providers', doc: this.state.itemUpdates['facilityName']}, {'ages': '10'});
//     await this.props.firestore.get('providers')
// };
{
    /*TO BE DELETED */
}
const galleryData = [
    {
        title: "Urban Tree Fundraiser",
        description:
            "Last Friday, we gathered for food, fun, and giving back at Urban Tree cidery. All proceeds from the evening went to our Bereavement fund. Everyone remembered to bring a sweater because the back deck got cold. We enjoyed drinks, games, and more!",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal2",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal3",
        description: "testing testing",
        imgLink:
            "https://static.vecteezy.com/system/resources/thumbnails/005/857/332/small_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg",
    },
    {
        title: "testVal4",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal1",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal2",
        description: "testing testing",
        imgLink:
            "https://static.vecteezy.com/system/resources/thumbnails/005/857/332/small_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg",
    },
    {
        title: "testVal3",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
        title: "testVal4",
        description: "testing testing",
        imgLink:
            "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
];

const SingleProvider = (props) => (
    <div>
        <div className="image-cover row-spaced mb-3">
            <div>
                <ButtonToolbar>
                    <Button
                        onClick={props.editProvider}
                        as={Link}
                        to={formRoute}
                        variant="info"
                        className="mr-2"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={async () => {
                            props.setLoading();
                            const collections =
                                props.firestore.collection("providers");
                            await collections
                                .where("id", "==", props.item.id)
                                .get()
                                .then(async (querySnapshot) => {
                                    await querySnapshot.forEach((doc) => {
                                        doc.ref.delete();
                                    });
                                });
                            await props.firestore.get("providers");
                            props.resetIndex();
                        }}
                    >
                        Delete
                    </Button>
                </ButtonToolbar>
            </div>
        </div>
        <div
            className="scroll-container"
            style={{ maxHeight: "100vh", top: "0", paddingTop: 20 }}
        >
            <Container>
                <ProviderInfo item={props.item} categories={props.categories} />
                {/*TO BE DELETED */}
                <ProviderGalleryCarousel slidesArray={galleryData} />
            </Container>
        </div>
    </div>
);

export default withFirestore(SingleProvider);

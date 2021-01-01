import { GOOGLE_API_KEY } from "../config/keys";

async function providerFromId(nctId: string) {
    const query = await fetch("https://app.clinwiki.org/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "https://mapscout.io",
        },
        body: JSON.stringify({
            query: `query {
                    study (nctId: ${nctId}) {
                      briefTitle
                      briefSummary
                      #latitude/longitude
                      conditions
                      facilities {
                        state
                        name
                        contacts {
                          phone
                        }
                        location {
                          latitude
                          longitude
                        }
                      }
                    }
                  }`,
        }),
    }).then((r) => r.json());
    const provider = {
        Disease: query?.data?.study?.conditions?.split("|") ?? [""],
        address: [query?.data?.study?.facilities[0]?.name] ?? "Test",
        description: query?.data?.study?.briefSummary ?? "",
        facilityName: query?.data?.study?.briefTitle ?? "",
        latitude: query?.data?.study?.facilities[0]?.location?.latitude ?? 0,
        longitude: query?.data?.study?.facilities[0]?.location?.longitude ?? 0,
        phoneNum: [query?.data?.study?.facilities[0]?.contacts[0]?.phone ?? ""],
        team: "clinwiki",
        website: [`https://app.clinwiki.org/study/${nctId}`],
    };
    //TODO: default lat/long
    if (
        (provider.latitude === 0 || provider.longitude === 0) &&
        !!provider.facilityName
    ) {
        const filteredName = (
            provider.address + query?.data?.study?.facilities[0]?.state
        ).replace(/[^a-zA-Z ]/g, "");
        const newCoords = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${filteredName}&key=${GOOGLE_API_KEY}`
        ).then((r) => r.json());
        if (newCoords.status != "ZERO_RESULTS") {
            provider.latitude =
                newCoords["results"][0]["geometry"]["location"]["lat"];
            provider.longitude =
                newCoords["results"][0]["geometry"]["location"]["lng"];
        }
    }
    //@ts-ignore
    return provider;
}

async function loadClinwikiProviders(searchHash: string) {
    const clinwikiProviders = [];
    const clinwikiIds = await fetch("https://app.clinwiki.org/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "https://mapscout.io",
        },
        body: JSON.stringify({
            query: `query { search(searchHash: "${searchHash}")
                {
                studies {
                nctId
                    }
                }}`,
        }),
    }).then((r) => r.json());
    if (clinwikiIds.data) {
        await Promise.all(
            clinwikiIds.data.search.studies.map(async (id) => {
                const provider = await providerFromId(id.nctId);
                clinwikiProviders.push(provider);
            })
        );
    }
    return clinwikiProviders.filter(
        (provider) => provider.latitude !== 0 && provider.longitude !== 0
    );
}

export { loadClinwikiProviders };

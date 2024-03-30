import React, { useEffect, useState } from 'react';
import { features } from "./features";
import { usePrismicClient } from '@prismicio/react';

function FeatureDisplays() {
  const client = usePrismicClient();

  const homepageData = client.getAllByType('homepage').then((response) => {
    console.log(response[0].data.body);
  }).catch((error) => {
    console.error(error);
  });

  console.log(homepageData);

  return (
    <div>
      {features.map((feature, index) => (
        <section
            id="product"
            key={index}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                padding: "2rem",
                // backgroundColor: index % 2 === 1 ? "#F3F3F3" : "white",
            }}
        >
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    width: 'auto', height: '60vh',
                    // flexDirection: index % 2 === 1 ? 'row' : 'row-reverse',
                }}>
                    <div>
                        <h1><b>{feature.title}</b></h1>
                        <p>{feature.description}</p>
                    </div>
                    <video controls width="80%" height="60%" autoPlay loop muted preload="auto" poster="./map2.png" >
                      <source src ={feature.videoPath}  type="video/mp4"/>
                      <p>Video unable to load</p>
                    </video>
                </div>
        </section>
      ))}
    </div>
  );
}

export default FeatureDisplays;

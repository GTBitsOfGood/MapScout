import React from 'react';
import { features } from "./features";

function FeatureDisplays() {
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
            }}
        >
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    flexDirection: index % 2 === 1 ? 'row' : 'row-reverse', 
                    paddingBottom: '10%'
                }}>
                    <div style={{width:"50%"}}>
                        <h1><b>{feature.title}</b></h1>
                        <p>{feature.description}</p>
                    </div>
                    <span style={{width:"2%"}}/>
                    <video width="60%" height="60%" autoPlay loop muted preload="auto" poster={feature.poster} >
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

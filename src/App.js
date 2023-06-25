import * as THREE from "three";
import React, { useRef, Suspense } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./App.css";
import img from './Artboard.png';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ButtonGroup } from "./components/ButtonGroup";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#000000",
    },
  },
  shape: {
    borderRadius: "50em",
  },
});

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);


    void main() {
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0); 
    }
  `
);

extend({ WaveShaderMaterial });

const Wave = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  const [image] = useLoader(THREE.TextureLoader, [img]);

  return (
    <mesh>
      <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={ref} uTexture={image} />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ fov: 12, position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
    </Canvas>
  );
};

const App = () => {
  return (
    <>
      {/* <h1>Alejandrina</h1> */}
      <Scene />
      <div className="footer">

        <ButtonGroup>
          <ThemeProvider theme={theme}>
            <Button variant="outlined" href="mailto:me@alejandrina.me" className="footer-button"
            >Contact</Button>
            <Button variant="outlined" href="https://www.github.com/agonzalezreyes/"
            >Github</Button>
            <Button variant="outlined" href="https://www.linkedin.com/in/alegore/"
            >LinkedIn</Button>
            </ThemeProvider>
         </ButtonGroup>

         {/* <p className="footer-text">Entrepreneur. Magician. Software Engineer.</p> */}
      </div>
    </>
  );
};

export default App;

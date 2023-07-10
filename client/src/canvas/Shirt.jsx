/* eslint-disable react/no-unknown-property */
import { easing } from "maath";
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei'

import state from "../store"

const Shirt = () => {

    const snap = useSnapshot(state);//set variable to state handled by valtio

    const { nodes, materials } = useGLTF('/shirt_baked.glb');

    const logoTexture = useTexture(snap.logoDecal) //set to state values
    const fullTexture = useTexture(snap.fullDecal);

    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

    //to make sure that the react app is tracking the shirts color state
    const stateString = JSON.stringify(snap)

  return (
    <group key={stateString}>
        <mesh //add a threejs mesh 
            castShadow
            geometry={nodes.T_Shirt_male.geometry} //fill mesh with model properties
            material={materials.lambert1}
            material-roughness={1}
            dispose={null}
        >
            {snap.isFullTexture && (
                <Decal 
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                    scale={1}
                    map={fullTexture}
                />
            )}

            {snap.isLogoTexture && (
                <Decal 
                    position={[0, 0.04, 0.15]}
                    rotation={[0, 0, 0]}
                    scale={0.15}
                    map={logoTexture}
                    anisotropy={16}
                    depthTest={false}
                    depthWrite={true}
                />
            )}
        </mesh>
    </group>
  )
}

export default Shirt
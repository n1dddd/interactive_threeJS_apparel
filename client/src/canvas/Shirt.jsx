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

  return (
    <group>
        <mesh //add a threejs mesh 
            castShadow
            geometry={nodes.T_Shirt_male.geometry} //fill mesh with model properties
            material={materials.lambert1}
            material-roughness={1}
            dispose={null}
        >
        </mesh>
    </group>
  )
}

export default Shirt
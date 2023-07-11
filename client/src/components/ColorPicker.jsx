import React from 'react'
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';

import state from '../store'

const ColorPicker = () => {

  const snap = useSnapshot(state);

  return (
    <div className="absolute left-full ml-3">
      <SketchPicker 
        color={snap.color} //display the color being held in state
        disableAlpha
        onChange={(color) => state.color = color.hex} //from the sketchpicker, state variable color, is set to color from sketchpicker
      />
    </div>
  )
}

export default ColorPicker
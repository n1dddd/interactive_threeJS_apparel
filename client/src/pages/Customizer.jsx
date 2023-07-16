import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from '../config/motion';

import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
    const snap = useSnapshot(state);

    const [file, setFile] = useState('');

    const [activeEditorTab, setActiveEditorTab] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);
    const [activeFilterTab, setactiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false
    })

    //show tab content depending on the activeTab
    const generateTabContent = () =>{ //switch statement to dynamically display chosen tab action component
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker />
            case "filepicker":
                return <FilePicker 
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />
            case "aipicker":
                return <AIPicker 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null;
        }
    }

    const handleSubmit = async(type) => {
        if(!prompt) return alert("Please enter a prompt");

        try {
            //call our backend to generate an ai image
        } catch(error) {
            alert(error)
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("")
        }
    }

    /*
    Read passed in file from filepicker component.
    Then the result is passed into handleDecals.
    This can be either logo or full, based on the
    button pressed upon upload. handleDecals will 
    assign a variable to the type, the type will be 
    found in state, and set to the new type (result).
    Finally handleActive filters is checked to see 
    if active (the filter type, so being logo or full),
    and sets the filter type to the one chosen in the 
    file upload tab 
    */
    const readFile = (type) => {
        reader(file)
        .then((result) => {
            handleDecals(type, result);
            setActiveEditorTab("");
        })
    }

    const handleDecals = (type, result) => {

        //set the passed img file type to 
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;

        if(!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab);
        }
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            default:
                state.isFullTexture = false;
                state.isLogoTexture = true;
        }

        //after setting the state, activeFilterTab is updated

        setactiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName]
            }
        })
    }
    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className="absolute top-0 left-0 z-10" //set position of tab container
                        {...slideAnimation('left')}
                    >
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => setActiveEditorTab(tab.name)}
                                    >
                                    </Tab>
                                ))}

                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        {...fadeAnimation}
                    >
                        <CustomButton
                            type="filled"
                            title="Go Back"
                            handleClick={() => state.intro = true}
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />

                    </motion.div>
                    <motion.div
                        className="filtertabs-container"
                        {...slideAnimation('up')}
                    >
                        {FilterTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            >
                            </Tab>
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Customizer
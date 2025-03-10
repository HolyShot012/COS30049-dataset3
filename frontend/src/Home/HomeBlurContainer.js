import React, { useRef, useLayoutEffect, useState } from "react";
import Item from "./HomeBlurContainerItem";
import SwapContainer from "./HomeBlurContainerSwapContainer";
import PopUp from "./HomeBlurContainerPopup";
import '../style/home.css'
import cryptoImages from "./HomeBlurContainerCryptoImages";


const image1 = require("../asset/temp.png")
const BlurContainer = () => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [popUp, setPopUp] = useState(false)
    const [block, setBlock] = useState({

        image: image1,
        id: "SEL",
        name: "Seelecoin"
    })
    const cryptos = [
        { address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", id: "BTC", name: "Bitcoin", image: cryptoImages["bitcoin-btc-logo.png"] },
        { address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", id: "DOGE", name: "Dogecoin", image: cryptoImages["dogecoin-doge-logo.png"] },
        { address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", id: "ETH", name: "Ethereum", image: cryptoImages["ethereum-eth-logo.png"] },
        { address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", id: "PEPE", name: "Pepe", image: cryptoImages["pepe-pepe-logo.png"] },
        { address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", id: "POPCAT", name: "Popcat (SOL)", image: cryptoImages["popcat-sol-popcat-logo.png"] },
        { address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97", id: "SHIB", name: "Shiba Inu", image: cryptoImages["shiba-inu-shib-logo.png"] },
        { address: "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4", id: "SEL", name: "Seelecoin", image: image1 }
    ]

    useLayoutEffect(() => {
        const container = containerRef.current;
        setContainerHeight(container.offsetHeight);
        setContainerWidth(container.offsetWidth);
    }, []);

    const handleOnClick = () => {

        setPopUp(!popUp)
    }

    const getRandomLeft = () => {
        return Math.floor(Math.random() * containerWidth);
    }

    const getRandomTop = () => {
        return Math.floor(Math.random() * (containerHeight - 120));
    }
    const getRandomAnimation = () => {
        const animations = ['float1', 'float2', 'float3', 'float4'];
        return animations[Math.floor(Math.random() * animations.length)];
    }
    const getRandomShape = () => {
        const shapes = ['circle', 'square']
        return shapes[Math.floor(Math.random() * shapes.length)];
    }
    return (

        <>

            <div className="home-component-1" id="home-component-1">

                <div ref={containerRef} className="blur-container">

                    {
                        Array(6).fill(0).map((item, index) => {
                            return (

                                <Item
                                    crypto={cryptos[index]}
                                    key={index} // Assign a unique key to each item
                                    top={getRandomTop()} // Generate random top value
                                    left={getRandomLeft()} // Generate random left value
                                    animation={getRandomAnimation()}
                                    shape={getRandomShape()}
                                />

                            )
                        }
                        )
                    }



                </div>

                <div className="home-component--content">
                    <h1 className="home-component--title">Search anytime, anywhere</h1>

                    <SwapContainer handleOnClick={handleOnClick} id={block.id} image={block.image} name={block.name} />
                    <p className="home-component--footer">the best crypto exchange</p>

                </div>
            </div >
            <PopUp onClick={handleOnClick} setBlock={setBlock} show={popUp} />

        </>
    )
}

export default BlurContainer
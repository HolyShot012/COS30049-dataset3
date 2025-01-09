import React from "react";
import Menu from "../Menu";
import Footer from "../Footer"
import Container1 from "../Container-1";
import BlurContainer from "../BlurComponent";
import IntroductionCard from "../gradientBorderCard";
import Sphere from "../Sphere";
const Home = () => {
    return (
        <>
        <Menu />
        <Container1 />
        <BlurContainer />
        <IntroductionCard />
        <Footer />
        </>
    )
}

export default Home
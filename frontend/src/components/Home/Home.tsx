import type { JSX } from "react";
import { Navbar } from "../Layout/Navbar";
import { HeroSection } from "./HeroSection";
import { Footer } from "../Layout/Footer";
import { CardSection } from "./CardSection";

export const Home = (): JSX.Element => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <CardSection />
            <Footer />
        </>
        
    );
}
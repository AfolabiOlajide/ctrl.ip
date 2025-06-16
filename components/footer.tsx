import React from "react";
import { FlickeringGrid } from "./ui/flickering-grid";

const Footer = () => {
    return (
        <footer className="border-t border-secondary/30">
            <div className="w-full h-48 md:h-54 relative mt-24 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background z-10 from-40%" />
                <div className="absolute inset-0 mx-6">
                    <FlickeringGrid
                        text={"CTRL.IP"}
                        fontSize={90}
                        className="h-full w-full"
                        squareSize={2}
                        gridGap={3}
                        // color="#6B7280"
                        color="#c562af"
                        maxOpacity={0.3}
                        flickerChance={0.1}
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;

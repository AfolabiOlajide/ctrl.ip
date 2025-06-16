"use client";
import { SITE_NAME } from "@/lib/constants";
import { ConnectButton } from "@tomo-inc/tomo-evm-kit";

import React from "react";
import { ModeToggle } from "./theme/mode-toggle";
import Link from "next/link";

const Nav = () => {
    return (
        <nav className="px-6 border-b border-secondary/30 sticky top-0 bg-background/20 backdrop-blur-[2rem]">
            <div className="nav-container p-4 flex justify-between ">
                <Link href="/">
                    <div className="logo">
                        <span className="font-bold text-2xl uppercase text-secondary">
                            {SITE_NAME}
                        </span>
                    </div>
                </Link>
                <div className="nav-links flex items-center gap-4">
                    <Link
                        href={"/search-ip"}
                        className="font-bold hover:text-secondary"
                    >
                        Search
                    </Link>

                    <Link
                        href={"/register-ip"}
                        className="font-bold hover:text-secondary"
                    >
                        Register
                    </Link>
                </div>
                <div className="connect-btn flex items-center gap-4">
                    {/* {
                        address ? (
                            <Button variant="secondary" onClick={openConnectModal}>
                                Disconnect
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={openConnectModal}>
                                Connect Wallet
                            </Button>
                        )
                    } */}
                    <ConnectButton />
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Nav;

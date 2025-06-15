"use client";
import { SITE_NAME } from "@/lib/constants";
import { ConnectButton } from "@tomo-inc/tomo-evm-kit";

import React from "react";
import { ModeToggle } from "./theme/mode-toggle";
import Link from "next/link";

const Nav = () => {
    return (
        <nav className="px-6 border-b border-secondary/30 sticky top-0 bg-background backdrop-blur">
            <div className="nav-container p-4 flex justify-between ">
                <div className="logo">
                    <span className="font-bold text-2xl uppercase">
                        {SITE_NAME}
                    </span>
                </div>
                <div className="nav-links flex items-center">
                    <Link
                        href={"/register-ip"}
                        className="font-bold hover:text-secondary"
                    >
                        Register IP
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

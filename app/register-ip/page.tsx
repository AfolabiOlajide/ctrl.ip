"use client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { registerIPAsset, uploadFIleToIPFS } from "@/lib/api";
import { useStory } from "@/lib/context/app-context";
import { IpCreator } from "@story-protocol/core-sdk";
import { set } from "date-fns";
import { se } from "date-fns/locale";
// import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
// import { useTomo, getWalletState } from "@tomo-inc/tomo-web-sdk";
import React, { useState } from "react";
import { toast } from "sonner";

const RegisterIP = () => {
    // const { openConnectModal } = useConnectModal();
    // const { walletState, providers } = useTomo();
    const { client } = useStory();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [mediaType, setMediaType] = useState<string>("");
    const [form, setForm] = useState<RegisterIPAssetPayload>({
        title: "",
        description: "",
        creators: [{ name: "", address: "", contribution: 100 }],
        image: "",
        mediaUrl: "",
        mediaType: "image", // default to image
        attributes: [{ key: "", value: "" }],
        defaultMintFee: 0,
        commercialRevShare: 0,
    });

    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        setForm((prev) => ({ ...prev, mediaType: files[0].type })); // set image(files[0].type);
        console.log(files);
    };

    const handleRegister = async () => {
        // if (!form.title || !form.description || !form.creators[0].address || !form.image || !form.mediaUrl) {
        //     alert("Please fill in required fields.");
        //     return;
        // }
        // upload image to ipfs
        setButtonDisabled(true);
        try {
            toast.info("Uploading file to IPFS...");
            uploadFIleToIPFS(files[0])
                .then((ipfsUrl) => {
                    console.log(ipfsUrl);
                    // register ip asset
                    toast.info("Registering IP asset...");
                    registerIPAsset({
                        ...form,
                        client: client,
                        image: ipfsUrl,
                        mediaUrl: ipfsUrl,
                    }).then((response) => {
                        toast.success("IP asset registered successfully.");
                        setButtonDisabled(false);
                        setForm({
                            title: "",
                            description: "",
                            creators: [
                                { name: "", address: "", contribution: 100 },
                            ],
                            image: "",
                            mediaUrl: "",
                            mediaType: "image", // default to image
                            attributes: [{ key: "", value: "" }],
                            defaultMintFee: 0,
                            commercialRevShare: 0,
                        });
                        console.log(response);
                    });

                    toast.success("Uploaded image to IPFS.");
                    setButtonDisabled(false);
                })
                .catch((error) => {
                    setButtonDisabled(false);
                    toast.error("Error uploading file to IPFS.");
                });
        } catch (error) {
            setButtonDisabled(false);
            toast.error(
                "Error uploading file to IPFS and resgistering IP asset."
            );
        }
    };

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreatorChange = (field: keyof IpCreator, value: any) => {
        const newCreators = [...form.creators];
        newCreators[0][field] = value;
        setForm((prev) => ({ ...prev, creators: newCreators }));
    };

    const handleAttributeChange = (field: keyof NFTAttributes, value: any) => {
        const newAttrs = [...(form.attributes ?? [])];
        newAttrs[0][field] = value;
        setForm((prev) => ({ ...prev, attributes: newAttrs }));
    };

    return (
        <div className="px-6">
            <div className="main-content  mt-10">
                <header className="p-4">
                    <h2 className="text-6xl font-bold uppercase text-center">
                        Register an IP Asset
                    </h2>
                    <p className="pt-6 text-center w-[60%] mx-auto">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Fugiat commodi accusamus ullam quibusdam, sequi nesciunt
                        officiis harum voluptas laudantium impedit perspiciatis
                        expedita culpa soluta.
                    </p>
                </header>
                <div className="form mt-10 border-y border-secondary/30 px-4 ">
                    <div className="flex flex-col items-center gap-[2.5rem] mx-auto w-full md:w-[50%] border-x border-secondary/30 py-10">
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="title" className="text-secondary">
                                Title
                            </Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label
                                htmlFor="description"
                                className="text-secondary"
                            >
                                Description
                            </Label>
                            <Textarea
                                placeholder="Type in your description..."
                                id="description"
                                value={form.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                            />
                        </div>
                        {/* creators */}
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label
                                htmlFor="creators"
                                className="text-secondary"
                            >
                                Creators
                            </Label>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    placeholder="Name"
                                    value={form.creators[0].name}
                                    onChange={(e) =>
                                        handleCreatorChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    type="text"
                                    id="address"
                                    placeholder="Address (0x...)"
                                    value={form.creators[0].address}
                                    onChange={(e) =>
                                        handleCreatorChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="contribution">
                                    Contribution (%)
                                </Label>
                                <Input
                                    type="text"
                                    id="contribution"
                                    placeholder="Contribution in percentage (e.g 100)"
                                    value={form.creators[0].contribution}
                                    onChange={(e) =>
                                        handleCreatorChange(
                                            "contributionPercent",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>
                        {/* Attributes */}
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label
                                htmlFor="creators"
                                className="text-secondary"
                            >
                                Attributes
                            </Label>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="key">Key</Label>
                                <Input
                                    type="text"
                                    id="key"
                                    placeholder="Key"
                                    value={form.attributes?.[0]?.key}
                                    onChange={(e) =>
                                        handleAttributeChange(
                                            "key",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="value">Value</Label>
                                <Input
                                    type="text"
                                    id="value"
                                    placeholder="Value"
                                    value={form.attributes?.[0]?.value}
                                    onChange={(e) =>
                                        handleAttributeChange(
                                            "value",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        {/* mint fee */}
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label
                                htmlFor="mint-fee"
                                className="text-secondary"
                            >
                                Mint Fee
                            </Label>
                            <Input
                                type="text"
                                placeholder="Mint Fee"
                                id="mint-fee"
                                onChange={(e) =>
                                    handleChange(
                                        "defaultMintFee",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </div>
                        {/* commercial rev share */}
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label
                                htmlFor="commercial-rev-share"
                                className="text-secondary"
                            >
                                Commercial Rev Share (%)
                            </Label>
                            <Input
                                type="text"
                                placeholder="Revenue share"
                                id="commercial-rev-share"
                                value={form.commercialRevShare}
                                onChange={(e) =>
                                    handleChange(
                                        "commercialRevShare",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </div>
                        {/* file upload */}
                        <div className="grid w-full max-w-sm items-center gap-3  mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-secondary/30 dark:border-secondary/30 rounded-lg">
                            <FileUpload onChange={handleFileUpload} />
                        </div>
                        {/* submit button */}
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Button
                                variant="secondary"
                                className="w-full font-bold text-white"
                                onClick={handleRegister}
                                disabled={buttonDisabled}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterIP;

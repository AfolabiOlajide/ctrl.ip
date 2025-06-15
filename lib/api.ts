import {
    Address,
    createPublicClient,
    http,
    parseEther,
    toHex,
    zeroAddress,
} from "viem";
import { getCurrentNetworkConfig } from "./context/network-context";
import {
    IpCreator,
    IpMetadata,
    LicenseTerms,
    StoryClient,
    WIP_TOKEN_ADDRESS,
} from "@story-protocol/core-sdk";
import axios from "axios";
import FormData from "form-data";
import { createHash } from "crypto";

// Docs: https://docs.story.foundation/developers/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address =
    "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";
export const RoyaltyPolicyLRP: Address =
    "0x9156e603C949481883B1d3355c6f1132D191fC41";
const SPGNFTContractAddress: Address =
    "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc";

/**
 * Get a configured public client based on the current network
 * @returns A viem public client configured for the current network
 */
export function getPublicClient() {
    // Get the current network config from the global state
    const config = getCurrentNetworkConfig();

    // Use the chain configuration from the SDK
    return createPublicClient({
        chain: config.chain,
        transport: http(config.rpcUrl),
    });
}

export const registerIPAsset = async function (
    payload: RegisterIPAssetPayload
) {
    if (!payload.client) {
        return;
    }
    // 1. Set up your IP Metadata
    //
    // Docs: https://docs.story.foundation/concepts/ip-asset/ipa-metadata-standard
    const ipMetadata: IpMetadata = payload.client.ipAsset.generateIpMetadata({
        title: payload.title,
        description: payload.description,
        createdAt: "1740005219", // change this to present time in seconds
        creators: payload.creators,
        image: payload.image,
        // imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
        mediaUrl: payload.mediaUrl,
        // mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
        mediaType: payload.mediaType,
    });

    // 2. Set up your NFT Metadata
    //
    // Docs: https://docs.opensea.io/docs/metadata-standards#metadata-structure
    const nftMetadata = {
        name: payload.title,
        description: payload.description,
        image: payload.image,
        animation_url: payload.animationUrl,
        attributes: payload.attributes,
    };

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
        .update(JSON.stringify(ipMetadata))
        .digest("hex");
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash("sha256")
        .update(JSON.stringify(nftMetadata))
        .digest("hex");

    // 4. Register the NFT as an IP Asset
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#mintandregisterip
    const response =
        await payload.client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
            spgNftContract: SPGNFTContractAddress,
            licenseTermsData: [
                {
                    terms: createCommercialRemixTerms({
                        defaultMintingFee: payload.defaultMintFee,
                        commercialRevShare: payload.commercialRevShare,
                    }),
                },
            ],
            ipMetadata: {
                ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                ipMetadataHash: `0x${ipHash}`,
                nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
                nftMetadataHash: `0x${nftHash}`,
            },
        });
    console.log("Root IPA created:", {
        "Transaction Hash": response.txHash,
        "IPA ID": response.ipId,
        "License Terms IDs": response.licenseTermsIds,
    });
    console.log(
        `View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`
    );

    return {
        txHash: response.txHash,
        ipId: response.ipId,
        licenseTermsIds: response.licenseTermsIds,
    };
};

export const registerDerivative = async function (
    payload: RegisterDerivativePayload
) {
    if (!payload.client) {
        return;
    }
    // 1. Mint and Register IP asset and make it a derivative of the parent IP Asset
    //
    // You will be paying for the License Token using $WIP:
    // https://aeneid.storyscan.xyz/address/0x1514000000000000000000000000000000000000
    // If you don't have enough $WIP, the function will auto wrap an equivalent amount of $IP into
    // $WIP for you.
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#mintandregisteripandmakederivative
    const childIp =
        await payload.client.ipAsset.mintAndRegisterIpAndMakeDerivative({
            spgNftContract: SPGNFTContractAddress,
            derivData: {
                parentIpIds: [payload.parentIpId],
                licenseTermsIds: [payload.parentLicenseTermsId],
            },
            // NOTE: The below metadata is not configured properly. It is just to make things simple.
            // See `simpleMintAndRegister.ts` for a proper example.
            ipMetadata: {
                ipMetadataURI: "test-uri",
                ipMetadataHash: toHex("test-metadata-hash", { size: 32 }),
                nftMetadataHash: toHex("test-nft-metadata-hash", { size: 32 }),
                nftMetadataURI: "test-nft-uri",
            },
        });
    console.log("Derivative IPA created and linked:", {
        "Transaction Hash": childIp.txHash,
        "IPA ID": childIp.ipId,
    });

    // 2. Parent Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const parentClaimRevenue = await payload.client.royalty.claimAllRevenue({
        ancestorIpId: payload.parentIpId,
        claimer: payload.parentIpId,
        childIpIds: [childIp.ipId as Address],
        royaltyPolicies: [RoyaltyPolicyLRP],
        currencyTokens: [WIP_TOKEN_ADDRESS],
    });
    console.log("Parent claimed revenue receipt:", parentClaimRevenue);
};

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            "Content-Type": "application/json",
        },
        data: {
            pinataOptions: { cidVersion: 0 },
            pinataMetadata: { name: "ip-metadata.json" },
            pinataContent: jsonMetadata,
        },
    };

    try {
        const response = await axios(url, options);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading JSON to IPFS:", error);
        throw error;
    }
}

// This is a pre-configured PIL Flavor:
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#flavor-%233%3A-commercial-remix
export function createCommercialRemixTerms(terms: {
    commercialRevShare: number;
    defaultMintingFee: number;
}): LicenseTerms {
    return {
        transferable: true,
        royaltyPolicy: RoyaltyPolicyLAP,
        defaultMintingFee: parseEther(terms.defaultMintingFee.toString()),
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: "0x",
        commercialRevShare: terms.commercialRevShare,
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: BigInt(0),
        currency: WIP_TOKEN_ADDRESS,
        uri: "https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json",
    };
}

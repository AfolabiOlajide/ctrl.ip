type NFTAttributes = {
    key: string;
    value: string;
};

type RegisterIPAssetPayload = {
    client?: StoryClient;
    title: string;
    description: string;
    creators: IpCreator[];
    image: string;
    mediaUrl: string;
    mediaType: string;
    animationUrl?: string;
    attributes?: NFTAttributes[];
    defaultMintFee: number;
    commercialRevShare: number;
};

type RegisterDerivativePayload = {
    client?: StoryClient;
    parentIpId: string;
    parentLicenseTermsId: string;
};

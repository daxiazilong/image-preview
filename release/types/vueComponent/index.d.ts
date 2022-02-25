export declare let _Vue: any;
declare let ImagePreviewVue: {
    install: (Vue: any) => void;
    imagePreview: {
        props: {
            images: ArrayConstructor;
        };
        mounted: () => void;
        beforeDestroy: () => void;
        render: Function;
    };
};
export { ImagePreviewVue };

export const parseImages = async (
    images: File[]
): Promise<{ originalIndex: number; image: string }[]> => {
    const imagesResult = [];
    return new Promise((resolve) => {
        images.forEach((image, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagesResult.push({ originalIndex: index, image: e.target.result });
                if (imagesResult.length === images.length) {
                    resolve(imagesResult);
                }
            };
            reader.readAsDataURL(image);
        });
    });
};

export const convertImageSrcsToFile = async (images: string[]) => {
    const promises = [];
    images.forEach((imageSrc) => {
        promises.push(fetch(imageSrc).then((res) => res.blob()));
    });
    const imagesBlobs = await Promise.all(promises);
    return imagesBlobs.map((imageFile, index) => {
        const name = images[index].split('/').pop();
        return new File([imageFile], name, {
            type: `image/${name.split('.').pop()}`,
        });
    });
};

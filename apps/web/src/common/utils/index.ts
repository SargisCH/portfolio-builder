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

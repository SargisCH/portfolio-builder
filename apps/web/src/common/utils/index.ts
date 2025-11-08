export const parseImages = async (images: File[]): Promise<string[]> => {
    const imagesResult = [];
    return new Promise((resolve) => {
        images.forEach((image) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagesResult.push(e.target.result);
                if (imagesResult.length === images.length) {
                    resolve(imagesResult);
                }
            };
            reader.readAsDataURL(image);
        });
    });
};

<template>
    <q-file
        v-model="filePickerValue"
        :label="props.placeholder || 'Pick files'"
        outlined
        multiple
        append
        style="max-width: 300px"
        :rules="[
            (val) =>
                (val && ['image/jpeg', 'image/png'].includes(val.type)) ||
                'Only JPEG and PNG images are allowed',
        ]"
    />
    <div class="col-12 row">
        <div
            v-for="(imageObject, index) in imagesRendered"
            :key="imageObject.originalIndex ?? imageObject"
        >
            <div class="q-ml-md relative-position image-item">
                <ImageActionsOverlay @delete="onDelete(index)" />
                <q-img
                    :src="imageObject.image || imageObject"
                    spinner-color="white"
                    style="height: 240px; width: 250px"
                />
            </div>
            <div class="q-ml-md">
                <q-btn
                    v-if="swapIndex > -1 && swapIndex !== index"
                    type="button"
                    @click="paste(index)"
                >
                    Paste
                </q-btn>
                <q-btn type="button" v-else-if="swapIndex !== index" @click="swap(index)"
                    >Swap</q-btn
                >
                <q-btn type="button" v-else-if="swapIndex === index" @click="swapCancel()"
                    >Cancel</q-btn
                >
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.image-item {
    > .overlay {
        visibility: hidden;
    }
    &:hover {
        > .overlay {
            visibility: visible;
        }
    }
}
</style>

<script setup lang="ts">
import { parseImages } from '@/common';
import ImageActionsOverlay from '@/app/components/features/project/ImageActionsOverlay.vue';

const props = defineProps(['placeholder', 'modelValue', 'preloadedImages']);
const emit = defineEmits(['update:modelValue']);

// Separate ref for the q-file picker — always File[] only
const filePickerValue = ref<File[]>([]);
// Mixed array: existing images as URL strings, new uploads as File objects
const images = ref<(File | string)[]>(props.preloadedImages || []);
const imagesRendered = ref<any[]>(props.modelValue || []);
const swapIndex = ref(-1);

const swap = (index: number) => {
    swapIndex.value = index;
};
const swapCancel = () => {
    swapIndex.value = -1;
};
let isSwapping = false;

const paste = (toIndex: number) => {
    const fromIndex = swapIndex.value;

    if (fromIndex === toIndex) {
        swapCancel();
        return;
    }

    isSwapping = true;

    const clonedImages = [...images.value];
    const clonedRendered = [...imagesRendered.value];

    const img1 = clonedImages[fromIndex];
    const img2 = clonedImages[toIndex];
    const rendered1 = clonedRendered[fromIndex];
    const rendered2 = clonedRendered[toIndex];

    clonedImages[fromIndex] = img2;
    clonedImages[toIndex] = img1;
    clonedRendered[fromIndex] = rendered2;
    clonedRendered[toIndex] = rendered1;

    images.value = clonedImages;
    imagesRendered.value = clonedRendered;

    swapCancel();
    emit('update:modelValue', images.value);

    setTimeout(() => {
        isSwapping = false;
    }, 50);
};

const onDelete = (index: number) => {
    isSwapping = true;

    const items = [...images.value];
    items.splice(index, 1);
    images.value = items;
    imagesRendered.value.splice(index, 1);

    emit('update:modelValue', images.value);

    setTimeout(() => {
        isSwapping = false;
    }, 50);
};

// When user picks files via q-file, push them into the mixed images array
watch(filePickerValue, (newFiles) => {
    if (!newFiles?.length) return;
    images.value = [...images.value, ...newFiles];
    filePickerValue.value = [];
});

watch(images, () => {
    if (isSwapping) return;

    emit('update:modelValue', images.value);

    if (images.value.length <= imagesRendered.value.length) return;

    const newItemsCount = images.value.length - imagesRendered.value.length;
    const itemsAdded = images.value.slice(-newItemsCount);

    // Only parse File objects — strings are already renderable URLs
    const newFiles = itemsAdded.filter((item): item is File => item instanceof File);
    if (newFiles.length === 0) return;

    parseImages(newFiles).then((imagesParsed: { originalIndex: number; image: string }[]) => {
        const startingIndex = imagesRendered.value.length;
        const adjustedParsed = imagesParsed.map((img, i) => ({
            ...img,
            originalIndex: startingIndex + i,
        }));
        imagesRendered.value = [...imagesRendered.value, ...adjustedParsed];
    });
});

onMounted(() => {
    emit('update:modelValue', images.value);

    if (props.preloadedImages?.length) {
        // Existing images are already URL strings — render them directly, no FileReader needed
        imagesRendered.value = props.preloadedImages.map((url: string, index: number) => ({
            originalIndex: index,
            image: url,
        }));
    }
});
</script>

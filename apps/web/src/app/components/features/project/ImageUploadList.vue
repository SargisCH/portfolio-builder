<template>
    <q-file
        v-model="images"
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
        <p>{{ imagesRendered.length }}</p>
        <div
            v-for="(imageObject, index) in imagesRendered"
            :key="imageObject.originalIndex || imageObject"
        >
            <div class="q-ml-md relative-position image-item">
                <p>{{ imageObject.originalIndex }} {{ imageObject.index }}</p>
                <ImageActionsOverlay @delete="onDelete(imageObject.originalIndex ?? -1, index)" />
                <q-img
                    :src="imageObject.image || imageObject"
                    spinner-color="white"
                    style="height: 240px; width: 250px"
                />
            </div>
            <div class="q-ml-md">
                <q-btn
                    v-if="swapIndex.index > -1 && swapIndex.index !== index"
                    type="button"
                    @click="
                        paste({
                            index,
                            originalIndex: imageObject.originalIndex,
                        })
                    "
                >
                    Paste
                </q-btn>
                <q-btn
                    type="button"
                    v-else-if="swapIndex.index !== index"
                    @click="
                        swap({
                            index,
                            originalIndex: imageObject.originalIndex,
                        })
                    "
                    >Swap</q-btn
                >
                <q-btn type="button" v-else-if="swapIndex.index === index" @click="swapCancel()"
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
import { QFile } from 'quasar';
import ImageActionsOverlay from '@/app/components/features/project/ImageActionsOverlay.vue';

const props = defineProps(['placeholder', 'modelValue', 'preloadedImages']);
const emit = defineEmits(['update:modelValue', 'delete:savedImage']);

const images = ref<File[]>(props.preloadedImages || []);
const imagesRendered = ref(props.modelValue || []);
const swapIndex = ref({
    index: -1,
    originalIndex: -1,
});

const swap = (indexes: { index: number; originalIndex: number }) => {
    const { index, originalIndex } = indexes;
    swapIndex.value = { index, originalIndex };
};
const swapCancel = () => {
    swapIndex.value = { index: -1, originalIndex: -1 };
};
const paste = (indexes: { index: number; originalIndex: number }) => {
    const { index, originalIndex } = indexes;
    const tempThumb = images.value[originalIndex];
    const uploadedTemp = imagesRendered.value[index];
    images.value[originalIndex] = images.value[swapIndex.value.originalIndex];
    imagesRendered.value[index] = imagesRendered.value[swapIndex.value.index];
    images.value[swapIndex.value.originalIndex] = tempThumb;
    imagesRendered.value[swapIndex.value.index] = uploadedTemp;
    swapIndex.value = { index: -1, originalIndex: -1 };
    emit('update:modelValue', images.value);
};
const onDelete = (indexToDelete: number, renderedIndex: number) => {
    if (indexToDelete > -1) {
        const items = Array.from(images.value);
        items.splice(indexToDelete, 1);
        images.value = items;
    }
    imagesRendered.value = imagesRendered.value
        .slice(0, renderedIndex)
        .concat(imagesRendered.value.slice(renderedIndex + 1));
    emit('update:modelValue', images.value);
};

watch(images, (newImages, prevImages) => {
    if (newImages.length <= prevImages.length) return;
    emit('update:modelValue', images.value);
    const imagesAdded = images.value.slice((newImages.length - prevImages.length) * -1);
    parseImages(imagesAdded).then((imagesParsed: { originalIndex: number; image: string }[]) => {
        imagesRendered.value = [...imagesRendered.value, ...imagesParsed];
    });
});
onMounted(() => {
    emit('update:modelValue', images.value);
    parseImages(props.preloadedImages).then(
        (imagesParsed: { originalIndex: number; image: string }[]) => {
            imagesRendered.value = imagesParsed;
        }
    );
});
</script>

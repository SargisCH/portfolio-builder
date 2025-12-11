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
                <ImageActionsOverlay @delete="onDelete(index)" />
                <q-img
                    :src="imageObject.image || imageObject"
                    spinner-color="white"
                    style="height: 240px; width: 250px"
                />
                <span>{{ imageObject.id }}</span>
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
import { QFile } from 'quasar';
import ImageActionsOverlay from '@/app/components/features/project/ImageActionsOverlay.vue';

const props = defineProps(['placeholder', 'modelValue', 'preloadedImages']);
const emit = defineEmits(['update:modelValue', 'delete:savedImage']);

const images = ref<File[]>(props.preloadedImages || []);
const imagesRendered = ref(props.modelValue || []);
const swapIndex = ref(-1);

const swap = (index: number) => {
    swapIndex.value = index;
};
const swapCancel = () => {
    swapIndex.value = -1;
};
const paste = (index: number) => {
    const tempImage = images.value[index];
    const renderedTemp = imagesRendered.value[index];
    images.value[index] = images.value[swapIndex.value];
    imagesRendered.value[index] = imagesRendered.value[swapIndex.value];
    images.value[swapIndex.value] = tempImage;
    imagesRendered.value[swapIndex.value] = renderedTemp;
    swapIndex.value = -1;
    emit('update:modelValue', images.value);
};
const onDelete = (index: number) => {
    if (index > -1) {
        const items = Array.from(images.value);
        items.splice(index, 1);
        images.value = items;
    }
    imagesRendered.value = imagesRendered.value
        .slice(0, index)
        .concat(imagesRendered.value.slice(index + 1));
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

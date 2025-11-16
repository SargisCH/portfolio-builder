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
        <div v-for="(imageObject, index) in imagesRendered" :key="imageObject.originalIndex">
            <div class="q-ml-md relative-position image-item">
                <ImageActionsOverlay @delete="onDelete(imageObject.originalIndex, index)" />
                <q-img
                    :src="imageObject.image"
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

const props = defineProps(['placeholder']);

const emit = defineEmits(['update:modelValue']);

const images = ref([]);
const imagesRendered = ref([]);
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
    const items = Array.from(images.value);
    items.splice(indexToDelete);
    images.value = items;
    imagesRendered.value.splice(renderedIndex, 1);
    emit('update:modelValue', images.value);
};

watch(images, () => {
    emit('update:modelValue', images.value);
    if (images.value.length < imagesRendered.value.length) return;
    const imagesAdded = images.value.slice(
        imagesRendered.value.length ? imagesRendered.value.length - 1 : 0
    );
    parseImages(imagesAdded).then((imagesParsed: { originalIndex: number; image: string }[]) => {
        imagesRendered.value = imagesParsed;
    });
});
</script>

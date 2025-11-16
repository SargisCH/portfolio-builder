<template>
    <div class="full-height full-width column absolute z-top container overlay">
        <div class="row justify-end full-width">
            <q-btn icon="mdi-close" color="negative" @click="handleDelete" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    background-color: rgba(184, 184, 184, 0.3);
}
.move-text {
    text-align: center;
    color: $pink-9;
}
</style>

<script setup lang="ts">
const emit = defineEmits(['delete']);

const handleDelete = () => {
    emit('delete');
};

// interface Props {
// }

// const props = defineProps<Props>();
</script>

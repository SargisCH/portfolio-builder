<template>
    <AppPage :loading="projectAction.isLoading">
        <template v-slot:header>
            <UserHeader title="project" />
        </template>

        <div class="row q-col-gutter-lg">
            <div class="col-12">
                <AppCard
                    :title="$t('project')"
                    @submit="saveAction.execute(500)"
                    :validation-schema="projectCreateSchema"
                    :initial-values="form"
                    is-form
                >
                    <template #default>
                        <q-card-section class="row q-col-gutter-md">
                            <VInput
                                class="col-12 col-lg-6"
                                name="title"
                                v-model="form.title"
                                :label="$t('title')"
                                outlined
                            >
                            </VInput>

                            <VInput
                                class="col-12 col-lg-6"
                                name="description"
                                v-model="form.description"
                                :label="$t('description')"
                                outlined
                            >
                            </VInput>
                            <VInput
                                class="col-12 col-lg-6"
                                name="location"
                                v-model="form.location"
                                :label="$t('location')"
                                outlined
                            >
                            </VInput>

                            <VInput
                                class="col-12 col-lg-6"
                                name="date"
                                v-model="form.date"
                                :label="$t('date')"
                                outlined
                            >
                            </VInput>

                            <q-file
                                v-model="thumbs"
                                label="Pick files"
                                outlined
                                use-chips
                                multiple
                                append
                                chips
                                style="max-width: 300px"
                                :rules="[
                                    (val) =>
                                        (val && ['image/jpeg', 'image/png'].includes(val.type)) ||
                                        'Only JPEG and PNG images are allowed',
                                ]"
                            />
                            <div class="col-12 row">
                                <div
                                    class="q-ml-md relative-position image-item"
                                    v-for="(imageObject, index) in thumbsUploaded"
                                    :key="imageObject.originalIndex"
                                    draggable="true"
                                    @drag="console.log('draggg')"
                                    @dragover="handleDragOver(index, $event)"
                                    :data-dropIndex="index"
                                >
                                    <ImageActionsOverlay
                                        @delete="onDelete(imageObject.originalIndex, index)"
                                    />
                                    <q-img
                                        :src="imageObject.image"
                                        spinner-color="white"
                                        style="height: 240px; width: 250px"
                                    />
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-section class="text-center text-negative" v-if="saveError">
                            {{ saveError }}
                        </q-card-section>
                    </template>

                    <template #actions>
                        <q-space />

                        <q-btn
                            icon="mdi-check  "
                            :label="$t('save')"
                            type="submit"
                            :loading="saveAction.isLoading"
                            :disable="saveAction.isLoading"
                            color="primary"
                            rounded
                        />
                    </template>
                </AppCard>
            </div>
        </div>
    </AppPage>
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
import { api, usePromiseState, ResponseError, parseImages } from '@/common';
import { ProjectResponse, ProjectCreateDto, projectCreateSchema } from '@workspace/shared';
import { useI18n } from 'vue-i18n';
import { useQuasar, QFile } from 'quasar';
import ImageActionsOverlay from '@/app/components/features/project/ImageActionsOverlay.vue';

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const isNew = route.params.id === 'new';

const form = reactive<ProjectCreateDto>({
    title: '',
    description: '',
    location: '',
    date: null,
    images: [],
    thumbs: [],
    tools: '',
});

const thumbs = ref([]);
const thumbsUploaded = ref([]);

function loadForm(data: ProjectResponse) {
    form.title = data.title;
    form.description = data.description;
    form.location = data.location;
    form.images = data.images;
    form.thumbs = data.thumbs;
    form.tools = data.tools;
    form.date = data.date;
}

const saveAction = usePromiseState<void, ResponseError>(async () => {
    // const { data } = await api.users.updateOne(userAction.state.id, form);
    // loadForm(data);
    console.log('thumbs', thumbs.value[0]);
});

const projectAction = usePromiseState<void, ResponseError>(async () => {
    // const { data } = await api.users.updateOne(userAction.state.id, form);
    // loadForm(data);
});
const saveError = computed<string>(() => {
    if (saveAction.error) return t('project_form_errors_default');

    return undefined;
});

const handleDragOver = (dragIndex, event) => {
    console.log(event, dragIndex);
};

const onDelete = (indexToDelete, renderedIndex) => {
    const items = Array.from(thumbs.value);
    items.splice(indexToDelete);
    thumbs.value = items;
    thumbsUploaded.value.splice(renderedIndex, 1);
};

watch(form, () => {
    saveAction.error = undefined;
});
watch(thumbs, () => {
    console.log('thumbs', thumbs.value.length, thumbsUploaded.value.length);
    if (thumbs.value.length < thumbsUploaded.value.length) return;
    const imagesAdded = thumbs.value.slice(
        thumbsUploaded.value.length ? thumbsUploaded.value.length - 1 : 0
    );
    parseImages(imagesAdded).then((imagesParsed: { originalIndex: number; image: string }[]) => {
        thumbsUploaded.value = imagesParsed;
    });
});
</script>

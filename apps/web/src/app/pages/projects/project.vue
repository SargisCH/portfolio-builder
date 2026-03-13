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
                    :validation-schema="isNew ? projectCreateSchema : projectUpdateSchema"
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
                                name="area"
                                v-model="form.area"
                                :label="$t('area')"
                                outlined
                            >
                            </VInput>

                            <VInput
                                class="col-12 col-lg-6"
                                name="tools"
                                v-model="form.tools"
                                :label="$t('tools')"
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
                            <VInput
                                class="col-12 col-lg-6 invisible"
                                disabled="true"
                                name="placeholder"
                            >
                            </VInput>
                            <VInput
                                class="col-12 col-lg-6"
                                name="sortIndex"
                                v-model="form.sortIndex"
                                label="Sort Index"
                                outlined
                            >
                            </VInput>
                            <div class="col-12" v-if="isNew || preloadedThumbs !== undefined">
                                <ImageUploadList
                                    :key="thumbsKey"
                                    placeholder="Upload thumbs"
                                    @update:modelValue="handleThumbsUpdate"
                                    :preloadedImages="preloadedThumbs"
                                />
                            </div>
                            <div class="col-12" v-if="isNew || preloadedRenders !== undefined">
                                <ImageUploadList
                                    :key="rendersKey"
                                    placeholder="Upload renders"
                                    @update:modelValue="handlerRendersUpdate"
                                    :preloadedImages="preloadedRenders"
                                />
                            </div>
                        </q-card-section>

                        <q-card-section class="text-center text-negative" v-if="saveError">
                            {{ saveError }}
                        </q-card-section>
                        <q-card-section class="text-center text-warning" v-if="hasUnuploadedFiles && !isNew">
                            There are files that haven't been uploaded yet. Please upload before saving.
                        </q-card-section>
                    </template>

                    <template #actions>
                        <q-space />

                        <q-btn
                            v-if="hasUnuploadedFiles && !isNew"
                            icon="mdi-upload"
                            label="Upload"
                            type="button"
                            :loading="uploadAction.isLoading"
                            :disable="uploadAction.isLoading"
                            color="secondary"
                            rounded
                            class="q-mr-sm"
                            @click="uploadAction.execute()"
                        />

                        <q-btn
                            icon="mdi-check"
                            :label="$t('save')"
                            type="submit"
                            :loading="saveAction.isLoading"
                            :disable="saveAction.isLoading || (hasUnuploadedFiles && !isNew)"
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
import { api, usePromiseState, ResponseError } from '@/common';
import { ProjectResponse, projectCreateSchema, projectUpdateSchema } from '@workspace/shared';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import ImageUploadList from '@/app/components/features/project/ImageUploadList.vue';

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const isNew = route.params.id === 'new';

const thumbs = ref<(File | string)[]>();
const renders = ref<(File | string)[]>();

const preloadedThumbs = ref<string[]>();
const preloadedRenders = ref<string[]>();

const thumbsKey = ref(0);
const rendersKey = ref(0);

function handleThumbsUpdate(images: (File | string)[]) {
    thumbs.value = images;
}
function handlerRendersUpdate(images: (File | string)[]) {
    renders.value = images;
}

const hasUnuploadedFiles = computed(() => {
    const thumbHas = (thumbs.value || []).some((f) => f instanceof File);
    const renderHas = (renders.value || []).some((f) => f instanceof File);
    return thumbHas || renderHas;
});

const form = reactive<ProjectResponse>({
    title: '',
    description: '',
    location: '',
    area: '',
    date: '',
    renders: [],
    thumbs: [],
    tools: '',
    sortIndex: null,
});

function loadForm(data: ProjectResponse) {
    form.title = data.title;
    form.description = data.description;
    form.location = data.location;
    form.area = data.area;
    form.renders = data.renders;
    form.thumbs = data.thumbs;
    form.tools = data.tools;
    form.date = data.date;
    form.sortIndex = data.sortIndex;
}

const uploadAction = usePromiseState<void, ResponseError>(async () => {
    const thumbFiles = (thumbs.value || []).filter((f): f is File => f instanceof File);
    const renderFiles = (renders.value || []).filter((f): f is File => f instanceof File);

    const { data } = await api.projects.uploadImages(route.params.id as string, {
        thumbs: thumbFiles,
        renders: renderFiles,
    });

    // Replace File objects with the returned URLs, preserving order
    let tIdx = 0;
    const resolvedThumbs = (thumbs.value || []).map((item) =>
        item instanceof File ? data.thumbs[tIdx++] : item
    ) as string[];

    let rIdx = 0;
    const resolvedRenders = (renders.value || []).map((item) =>
        item instanceof File ? data.renders[rIdx++] : item
    ) as string[];

    // Update preloaded URLs and remount the components with the resolved state
    preloadedThumbs.value = resolvedThumbs;
    preloadedRenders.value = resolvedRenders;
    thumbsKey.value++;
    rendersKey.value++;
});

const saveAction = usePromiseState<void, ResponseError>(async () => {
    if (isNew) {
        await api.projects.createOne({
            ...form,
            thumbs: (thumbs.value || []).filter((f): f is File => f instanceof File),
            renders: (renders.value || []).filter((f): f is File => f instanceof File),
        });
    } else {
        await api.projects.updateProject(route.params.id as string, {
            ...form,
            thumbs: (thumbs.value || []) as string[],
            renders: (renders.value || []) as string[],
        });
    }
    $q.notify({
        icon: 'mdi-check',
        color: 'positive',
        message: t('saved_successfully'),
        timeout: 1000,
    });
    router.push({ name: 'projects' });
});

const projectAction = usePromiseState<ProjectResponse | void, ResponseError>(async () => {
    if (isNew) return;
    try {
        const { data } = await api.projects.getProject(route.params.id as string);
        preloadedThumbs.value = data.thumbs;
        preloadedRenders.value = data.renders;
        loadForm(data);
    } catch (e) {
        console.log('eee', e);
    }
});

projectAction.execute();
const saveError = computed<string>(() => {
    if (saveAction.error) return t('project_form_errors_default');
    return undefined;
});

watch(form, () => {
    saveAction.error = undefined;
});
</script>

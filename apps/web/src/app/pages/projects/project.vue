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
                                name="date"
                                v-model="form.date"
                                :label="$t('date')"
                                outlined
                            >
                            </VInput>
                            <ImageUploadList
                                :modelValue="thumbsModelValue"
                                placeholder="Upload thumbs"
                                @update:modelValue="handleThumbsUpdate"
                                :preloadedImages="preloadedThumbs"
                            />
                            <ImageUploadList
                                :modelValue="rendersModelValue"
                                placeholder="Upload renders"
                                @update:modelValue="handlerRendersUpdate"
                                :preloadedImages="preloadedRenders"
                            />
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
import { api, usePromiseState, ResponseError, convertImageSrcsToFile } from '@/common';
import {
    ProjectResponse,
    ProjectCreateDto,
    projectCreateSchema,
    projectUpdateSchema,
} from '@workspace/shared';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import ImageUploadList from '@/app/components/features/project/ImageUploadList.vue';

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const isNew = route.params.id === 'new';

const thumbs = ref<File[]>();
const renders = ref<File[]>();

const preloadedThumbs = ref<File[]>();
const preloadedRenders = ref<File[]>();
const deletedThumbs: string[] = [];
const deletedRenders: string[] = [];
const thumbsModelValue = ref<string[]>();
const rendersModelValue = ref<string[]>();

function handleThumbsUpdate(images: File[]) {
    thumbs.value = images;
}
function handlerRendersUpdate(images: File[]) {
    renders.value = images;
}

const form = reactive<ProjectResponse>({
    title: '',
    description: '',
    location: '',
    date: null,
    renders: [],
    thumbs: [],
    tools: '',
});

function loadForm(data: ProjectResponse) {
    form.title = data.title;
    form.description = data.description;
    form.location = data.location;
    form.renders = data.renders;
    form.thumbs = data.thumbs;
    form.tools = data.tools;
    form.date = data.date;
}
const saveAction = usePromiseState<void, ResponseError>(async () => {
    const submitData = {
        ...form,
        thumbs: thumbs.value,
        renders: renders.value,
    };
    if (isNew) {
        await api.projects.createOne(submitData);
    } else {
        await api.projects.updateProject(route.params.id as string, submitData);
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
        preloadedThumbs.value = await convertImageSrcsToFile(data.thumbs);
        preloadedRenders.value = await convertImageSrcsToFile(data.renders);

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

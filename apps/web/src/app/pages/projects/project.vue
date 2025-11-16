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
                            <ImageUploadList
                                placeholder="Upload thumbs"
                                @update:modelValue="handleThumbsUpdate"
                            />
                            <ImageUploadList
                                placeholder="Upload renders"
                                @update:modelValue="handlerRendersUpdate"
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
import { api, usePromiseState, ResponseError } from '@/common';
import { ProjectResponse, ProjectCreateDto, projectCreateSchema } from '@workspace/shared';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import ImageUploadList from '@/app/components/features/project/ImageUploadList.vue';

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const isNew = route.params.id === 'new';

const thumbs = ref<FileList>();
const renders = ref<FileList>();

function handleThumbsUpdate(images: FileList) {
    thumbs.value = images;
}
function handlerRendersUpdate(images: FileList) {
    renders.value = images;
}

const form = reactive<ProjectCreateDto>({
    title: '',
    description: '',
    location: '',
    date: null,
    images: [],
    thumbs: [],
    tools: '',
});

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
});

const projectAction = usePromiseState<void, ResponseError>(async () => {
    // const { data } = await api.users.updateOne(userAction.state.id, form);
    // loadForm(data);
});
const saveError = computed<string>(() => {
    if (saveAction.error) return t('project_form_errors_default');

    return undefined;
});

watch(form, () => {
    saveAction.error = undefined;
});
</script>

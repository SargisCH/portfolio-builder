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
                                <q-img
                                    class="q-ml-md"
                                    v-for="(img, index) in thumbsUploaded"
                                    :key="index"
                                    :src="img"
                                    spinner-color="white"
                                    style="height: 140px; max-width: 150px"
                                />
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

<script setup lang="ts">
import { api, usePromiseState, ResponseError, parseImages } from '@/common';
import { ProjectResponse, ProjectCreateDto, projectCreateSchema } from '@workspace/shared';
import { useI18n } from 'vue-i18n';
import { useQuasar, QFile } from 'quasar';

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

watch(form, () => {
    saveAction.error = undefined;
});
watch(thumbs, () => {
    console.log('thumbs', thumbs.value);
    const imagesAdded = thumbs.value.slice(
        thumbsUploaded.value.length ? thumbsUploaded.value.length - 1 : 0
    );
    parseImages(imagesAdded).then((imagesParsed: string[]) => {
        thumbsUploaded.value = imagesParsed;
    });
});
</script>

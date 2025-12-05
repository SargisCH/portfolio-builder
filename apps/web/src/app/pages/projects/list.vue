<template>
    <AppPage :loading="projectsAction.counter === 0">
        <template v-slot:header>
            <AppPageHeader :title="$t('routes_users')" icon="mdi-account-supervisor" />
        </template>

        <AppCard>
            <template #titleBar>
                <div class="row q-gutter-y-md full-width">
                    <div class="col-6 self-center">
                        <q-input
                            outlined
                            rounded
                            dense
                            debounce="500"
                            v-model="filter"
                            :placeholder="$t('search')"
                        >
                            <template v-slot:prepend>
                                <q-icon name="mdi-magnify" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-6 text-right self-center">
                        <q-btn
                            icon="mdi-plus"
                            :label="$t('add')"
                            :disable="projectsAction.isLoading"
                            color="primary"
                            rounded
                            :to="{ name: 'project', params: { id: 'new' } }"
                        />
                    </div>
                </div>
            </template>

            <q-card-section>
                <q-table
                    class="no-shadow"
                    row-key="id"
                    :rows="projectsAction.state"
                    :columns="columns"
                    :loading="!projectsAction.isReady"
                    @request="(props) => projectsAction.execute(500, props.pagination)"
                    :filter="filter"
                    color="primary"
                    v-model:pagination="pagination"
                    :rows-per-page-options="[5, 10, 20, 50]"
                >
                    <template v-slot:body-cell-edit="props">
                        <q-td class="text-left">
                            <q-btn
                                size="10px"
                                round
                                color="secondary"
                                icon="mdi-cog"
                                :to="{ name: 'project', params: { id: props.value } }"
                            />
                            <q-btn
                                size="10px"
                                class="q-ml-sm"
                                round
                                color="negative"
                                icon="mdi-delete"
                                @click="projectDeleteDialog(props.value)"
                            />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </AppCard>
    </AppPage>
</template>

<style module lang="scss">
.text-ellipsis {
    max-width: 150px;
    text-overflow: ellipsis;
    overflow-x: hidden;
}
</style>

<script setup lang="ts">
import { api, usePromiseState, ResponseError } from '@/common';
import { ProjectResponse } from '@workspace/shared';
import { QTableColumn, QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import ProjectDeleteDialog from '@/app/components/dialogs/ProjectDeleteDialog.vue';

const $q = useQuasar();
const { t } = useI18n();

const pagination = ref<QTableProps['pagination']>({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: 'role',
    descending: false,
});

const filter = ref('');

const columns: QTableColumn<ProjectResponse>[] = [
    {
        name: 'title',
        label: 'title',
        field: 'title',
        align: 'left',
    },
    {
        name: 'description',
        label: 'description',
        field: 'description',
        align: 'left',
        sortable: true,
        classes: () => 'text-ellipsis',
    },
    {
        name: 'location',
        label: 'location',
        field: 'location',
        align: 'left',
    },
    {
        name: 'tools',
        label: 'tools',
        field: 'tools',
        align: 'left',
    },
    {
        name: 'edit',
        label: 'edit',
        field: 'id',
        align: 'left',
    },
];

const projectsAction = usePromiseState<ProjectResponse[], ResponseError>(async () => {
    const res = await api.projects.getProjects();
    return res.data;
});
const deleteAction = usePromiseState<void, ResponseError>(async (projectId: string) => {
    await api.projects.deleteOne(projectId);
    projectsAction.execute(500);
});

function projectDeleteDialog(projectId: string): void {
    $q.dialog({
        component: ProjectDeleteDialog,
    }).onOk(() => {
        deleteAction.execute(500, projectId);
    });
}

projectsAction.execute(500, pagination.value);
</script>

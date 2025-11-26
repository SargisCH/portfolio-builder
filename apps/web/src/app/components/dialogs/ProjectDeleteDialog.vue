<template>
    <AppDialog icon="mdi-delete" title="Delete dialog" :width="600">
        <template #default>
            <q-card-section>
                <div class="row q-col-gutter-md">Are you sure you want to delete this project</div>
            </q-card-section>
        </template>

        <template #actions="{ cancel, ok }">
            <q-space />
            <q-btn
                color="secondary"
                icon="mdi-close"
                :label="$t('close')"
                @click="cancel"
                rounded
                outline
            />

            <q-btn
                color="negative"
                icon="mdi-delete"
                :label="$t('delete')"
                rounded
                @click="
                    ok();
                    cancel();
                "
            />
        </template>
    </AppDialog>
</template>

<script setup lang="ts"></script>

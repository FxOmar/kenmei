<template lang="pug">
  base-modal(
    :visible="visible"
    :loading="loading"
    size="sm"
    @dialogClosed="$emit('closeDialog')"
  )
    template(slot='body')
      .mt-3.text-center.sm_mt-0.sm_text-left
        base-form-input-select(
          v-model="currentIssue"
          valueKey="type"
          textKey="label"
          placeholder="Select issue type"
          :items="issues"
        )
        p.text-xs.leading-5.text-gray-500.mt-2
          template(v-if="currentIssue === 0")
            | Select this option, if manga information is outdated or incorrect.
            | Manga will attempt to update automatically, otherwise it will be
            | investigated in detail later.
          template(v-else)
            | Select this option, if manga titles are duplicated. They will be
            | manually updated so that only a single manga is shown.
    template(slot='actions')
      span.sm_ml-3.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(
          ref="reportEntriesButton"
          colour="danger"
          @click="report"
          :disabled="issueInvalid"
        )
          | Report
      span.mt-3.sm_mt-0.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(colour="secondary" @click="$emit('closeDialog')") Cancel
</template>

<script>
  import { Select, Option, Message } from 'element-ui';

  import {
    postMangaEntriesErrors,
  } from '@/services/endpoints/MangaEntriesErrors';

  export default {
    name: 'ReportMangaEntries',
    components: {
      'el-select': Select,
      'el-option': Option,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      selectedEntries: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        issues: [
          { type: 0, label: 'Incorrect Manga Data' },
          { type: 1, label: 'Duplicated Manga Series' },
        ],
        currentIssue: 0,
        loading: false,
      };
    },
    computed: {
      selectedEntriesIDs() {
        return this.selectedEntries.map((e) => e.id);
      },
      issueInvalid() {
        return this.currentIssue === 1 && this.selectedEntriesIDs.length < 2;
      },
    },
    methods: {
      async report() {
        this.loading = true;

        const successful = await postMangaEntriesErrors(
          this.selectedEntriesIDs, this.currentIssue,
        );

        this.loading = false;

        if (successful) {
          this.$emit('closeDialog');
          Message.success('Issue reported successfully');
        } else {
          Message.error(
            'Failed to report. Try reloading the page before trying again',
          );
        }
      },
    },
  };
</script>

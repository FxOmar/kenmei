<template lang="pug">
  base-modal(
    :visible="visible"
    :loading="loading"
    size="sm"
    @dialogClosed="$emit('closeDialog')"
  )
    template(slot='body')
      base-action-completed(
        v-if="importInitiated"
        :type="type"
        :header="completedActionHeader"
        :text="completedActionText"
        buttonText="Go back to dashboard"
        @completeAction="$emit('closeDialog')"
      )
      el-tabs.w-full(v-else v-model="activeTab" stretch)
        el-tab-pane(label="Trakr.moe" name="trackrMoe")
          el-upload(
            ref="upload"
            action=""
            :http-request="processUpload"
            :multiple="false"
            :show-file-list="false"
            accept="application/json"
            drag
            )
            i.el-icon-upload
            .el-upload__text
              | Drop file here or click to upload
            .el-upload__tip(slot="tip")
              | You can download your Trackr.moe list
              |
              el-link.align-baseline.text-xs(
                href="https://trackr.moe/user/options"
                :underline="false"
                target="_blank"
              )
                | here
        el-tab-pane(label="MangaDex" name="mangaDex")
          base-form-input.px-1(
            v-model.trim="$v.importURL.$model"
            :validator="$v.importURL"
            label="MDList URL"
            placeholder="https://mangadex.com/list/3"
            helperText="Provide your MangaDex MDList URL. It needs to be all lists link, not specific ones like Reading or Completed"
          )
            template(slot='icon')
              icon-link.h-5.w-5
    template(slot='actions' v-if="activeTab === 'mangaDex' && !importInitiated")
      span.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(ref="importMangaDexButton" @click="importMangaDex")
          | Import
</template>

<script>
  import { required, url } from 'vuelidate/lib/validators';
  import debounce from 'lodash/debounce';
  import {
    Tabs, TabPane, Link, Upload, Message,
  } from 'element-ui';

  import { processList } from '@/services/importer';
  import { postTrackrMoe, postMDList } from '@/services/endpoints/importers';

  export default {
    components: {
      'el-link': Link,
      'el-upload': Upload,
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        activeTab: 'trackrMoe',
        importURL: '',
        completedActionText: '',
        completedActionHeader: '',
        type: '',
        importInitiated: false,
        loading: false,
      };
    },
    validations: {
      importURL: {
        required,
        url,
        mustBeMangaDex(url) {
          return (/(mangadex.(cc|org)\/list[/])\d+$/.test(url));
        },
      },
    },
    watch: {
      visible: debounce(function(newVal) { //eslint-disable-line
        if (!newVal) {
          // Reset data to initial state
          Object.assign(this.$data, this.$options.data.call(this));
          this.$v.$reset();
        }
      }, 250),
    },
    methods: {
      async importMangaDex() {
        this.$v.$touch();
        if (this.$v.$invalid) return;

        this.loading = true;

        const response = await postMDList(this.importURL);

        if (response.status === 200) {
          this.completedActionHeader = 'Import started';
          this.type = 'success';
          this.completedActionText = response.data;
        } else if (response.status === 400) {
          this.completedActionHeader = 'Import currently in progress';
          this.type = 'danger';
          this.completedActionText = response.data;
        } else if (response.status === 404) {
          this.completedActionHeader = 'List is private';
          this.type = 'danger';
          this.completedActionText = response.data;
        } else {
          this.completedActionHeader = 'Something went wrong';
          this.type = 'danger';
          this.completedActionText = 'Try again later or contact hi@kenmei.co';
        }

        this.loading = false;
        this.importInitiated = true;
      },
      async processMangaDexList(list) {
        this.loading = true;

        const filteredLists = {};
        const listsToImport = processList(list);

        Object.entries(listsToImport).forEach(([name, list]) => {
          filteredLists[name] = list
            .map((url) => ({
              seriesURL: url.full_title_url,
              chapterURL: url.generated_current_data.url,
              lastRead: url.generated_current_data.number,
            }));
        });

        const response = await postTrackrMoe(filteredLists);

        if (response.status === 200) {
          this.completedActionHeader = 'Import started';
          this.type = 'success';
          this.completedActionText = response.data;
        } else if (response.status === 400) {
          this.completedActionHeader = 'Import currently in progress';
          this.type = 'danger';
          this.completedActionText = response.data;
        } else {
          this.completedActionHeader = 'Something went wrong';
          this.type = 'danger';
          this.completedActionText = 'Try again later or contact hi@kenmei.co';
        }

        this.loading = false;
        this.importInitiated = true;
      },
      processUpload(file) {
        const reader = new FileReader();

        reader.onload = ((theFile) => {
          const json = JSON.parse(theFile.target.result);

          if (json.series) {
            this.processMangaDexList(json);
          } else if (json.reading) {
            Message.error(
              `You are trying to import partial list. Please use export from
              Trakr.moe settings page.`,
            );
          } else {
            Message.error(
              'File is incorrect. Make sure you are uploading Trackr.moe export',
            );
          }
        });

        reader.readAsText(file.file);
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-upload, .el-upload-dragger {
    @apply w-full;
  }
</style>

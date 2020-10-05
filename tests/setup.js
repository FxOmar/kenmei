import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueI18n from 'vue-i18n';
import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { factories } from './factories';

// ===
// Utility functions
// ===

// https://vue-test-utils.vuejs.org/
const vueTestUtils = require('@vue/test-utils');

// ===
// Global helpers
// ===

// https://vue-test-utils.vuejs.org/api/#mount
global.mount = vueTestUtils.mount;
// https://vue-test-utils.vuejs.org/api/#shallowmount
global.shallowMount = vueTestUtils.shallowMount;
// https://vue-test-utils.vuejs.org/api/#createlocalvue
global.createLocalVue = vueTestUtils.createLocalVue;
// Enable factories globally
global.factories = factories;

// ===
// Register global components
// Used https://github.com/chrisvfritz/vue-enterprise-boilerplate/ for reference
// ===

const globalComponentFiles = fs
  .readdirSync(path.join(__dirname, '../src/components/base_components'));

globalComponentFiles.forEach((fileName) => {
  const componentName   = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '');
  const componentConfig = require(`../src/components/base_components/${fileName}`);

  Vue.component(componentName, componentConfig.default || componentConfig);
});

// ===
// Register global icons
// ===

const globalIconFiles = fs
  .readdirSync(path.join(__dirname, '../src/components/icons'));

globalIconFiles.forEach((fileName) => {
  const componentName   = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '');
  const componentConfig = require(`../src/components/icons/${fileName}`);

  Vue.component(componentName, componentConfig.default || componentConfig);
});

// ===
// Configure Vue
// ===

// Don't warn about not using the production build of Vue, as
// we care more about the quality of errors than performance
// for tests. Same for the Vue devtools
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Setup global libraries
Vue.use(Vuelidate);
Vue.use(VueI18n);

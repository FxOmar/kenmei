import BaseFooter from '../components/base_components/BaseFooter.vue';

export default { title: 'Base Components/Footer' };

export const Footer = () => ({
  components: { BaseFooter },
  template: '<base-footer />',
});

export const DarkFooter = () => ({
  components: { BaseFooter },
  template: '<base-footer dark />',
});

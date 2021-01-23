import NotFoundView from '../views/NotFound';

export default { title: 'Views/Not Found' };

export const NotFound = () => ({
  components: { NotFoundView },
  template: '<not-found-view />',
});

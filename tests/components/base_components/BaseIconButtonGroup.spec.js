import BaseIconButtonGroup from '@/components/base_components/BaseIconButtonGroup.vue';

const localVue = createLocalVue();

localVue.directive('tippy', true);

describe('BaseIconButtonGroup.vue', () => {
  let iconButtonGroup;

  beforeEach(() => {
    iconButtonGroup = shallowMount(BaseIconButtonGroup, {
      localVue,
      propsData: {
        buttons: [
          {
            text: 'Edit',
            icon: 'IconEdit',
            colour: 'primary',
          },
          {
            text: 'Delete',
            icon: 'IconTrash',
            colour: 'danger',
          },
        ],
      },
      stubs: {
        'icon-edit': true,
        'icon-trash': true,
      },
    });
  });

  describe('when buttons provided', () => {
    it('shows icon buttons', () => {
      expect(iconButtonGroup.html()).toMatchSnapshot();
    });

    describe('and a button is clicked', () => {
      it('emits click event with button text', async () => {
        await iconButtonGroup.find('button').trigger('click');

        expect(iconButtonGroup.emitted('click')[0]).toEqual(['Edit']);
      });
    });

    describe('and a button is disabled', () => {
      beforeEach(() => {
        iconButtonGroup.setProps({
          buttons: [
            {
              text: 'Edit',
              icon: 'IconEdit',
              colour: 'primary',
              disabled: true,
            },
          ],
        });
      });

      it('sets it as disabled and disables click event', async () => {
        expect(iconButtonGroup.get('button').element).toHaveClass('disabled');

        await iconButtonGroup.find('button').trigger('click');

        expect(iconButtonGroup.emitted('click')).toBeFalsy();
      });
    });
  });
});

import BaseFab from '@/components/base_components/BaseFab.vue';
import IconPlus from '@/components/icons/IconPlus.vue';

describe('BaseFab.vue', () => {
  let baseFab;

  describe('when open', () => {
    beforeEach(() => {
      baseFab = shallowMount(BaseFab, { data() { return { open: true }; } });
    });

    it('shows cross icon', () => {
      expect(baseFab.find('icon-cross-stub').element)
        .toHaveClass('opacity-100');
    });

    it.todo('disables scrolling');

    describe('when pressing Esc', () => {
      it('closes fab options', async () => {
        await baseFab.trigger('keydown.esc');

        expect(baseFab.vm.$open).toBeFalsy();
      });
    });

    describe('when pressing outside the fab', () => {
      it('closes fab options', async () => {
        await baseFab.findComponent({ ref: 'clickOffButton' }).trigger('click');

        expect(baseFab.vm.$open).toBeFalsy();
      });
    });

    describe('and options are provided', () => {
      beforeEach(() => {
        baseFab = shallowMount(BaseFab, {
          propsData: {
            options: [
              { text: 'Add manga', icon: 'icon-plus', action: 'addManga' },
            ],
          },
          data() { return { open: true }; },
        });
      });

      it('shows option buttons', async () => {
        expect(baseFab.findComponent(IconPlus).exists()).toBeTruthy();
        expect(baseFab.text()).toContain('Add manga');
      });

      describe('and fab option is pressed', () => {
        it('emits text of the option pressed', async () => {
          await baseFab.find('a').trigger('click');

          expect(baseFab.emitted('click')[0]).toEqual(['addManga']);
          expect(baseFab.vm.$open).toBeFalsy();
        });
      });
    });
  });

  describe('when closed', () => {
    beforeEach(() => {
      baseFab = shallowMount(BaseFab, { data() { return { open: false }; } });
    });

    it('hides cross icon', () => {
      expect(baseFab.find('icon-cross-stub').element).toHaveClass('opacity-0');
    });

    it.todo('enables scrolling');
  });
});

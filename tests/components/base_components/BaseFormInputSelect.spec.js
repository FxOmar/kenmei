import BaseFormInputSelect from '@/components/base_components/BaseFormInputSelect.vue';

describe('BaseFormInputSelect.vue', () => {
  let baseFormInputSelect;

  beforeEach(() => {
    baseFormInputSelect = mount(
      BaseFormInputSelect, { propsData: { items: [1, 2] } },
    );
  });

  describe('when label is provided', () => {
    it('shows label', async () => {
      await baseFormInputSelect.setProps({ label: 'Status' });

      expect(baseFormInputSelect.find('label').text()).toContain('Status');
    });
  });

  describe('when placeholder is provided', () => {
    it('sets input placeholder', async () => {
      await baseFormInputSelect.setProps({ placeholder: 'Select value' });

      const placeholder = baseFormInputSelect
        .findComponent({ ref: 'placeholderContainer' });

      expect(placeholder.text()).toContain('Select value');
    });
  });

  describe('when helperText is provided', () => {
    it.skip('shows helper text', async () => {
      await baseFormInputSelect.setProps({ helperText: 'Select status' });

      expect(baseFormInputSelect.text()).toContain('Select status');
    });
  });

  describe('when value is provided', () => {
    it('retrieves selectedLabel by searching items', async () => {
      await baseFormInputSelect.setProps({ value: 2 });

      expect(baseFormInputSelect.findComponent({ ref: 'selectedValueContainer' }).text())
        .toContain(2);
    });

    describe('and valueKey and textKey are provided', () => {
      it('retrieves selectedLabel using object keys', () => {
        const baseFormInputSelect = mount(
          BaseFormInputSelect, {
            propsData: {
              value: 1,
              items: [{ id: 0, label: 'Item 0' }, { id: 1, label: 'Item 1' }],
              valueKey: 'id',
              textKey: 'label',
            },
          },
        );

        expect(baseFormInputSelect.findComponent({ ref: 'selectedValueContainer' }).text())
          .toContain('Item 1');
      });
    });
  });

  describe('when valueKey and textKey are provided', () => {
    it.todo('retrieves selectedLabel using object keys');
    it.todo('retrieves items labels from textKey');
    it.todo('retrieves items values from valueKey');
  });

  describe('when selecting an item', () => {
    it.skip('emits item and hides Tippy dropdown', async () => {
      await baseFormInputSelect.findAll('li').at(0).trigger('click');

      expect(baseFormInputSelect.emitted('input')[0]).toEqual([1]);
    });
  });
});

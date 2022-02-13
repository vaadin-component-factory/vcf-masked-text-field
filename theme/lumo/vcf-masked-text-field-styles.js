import '@vaadin/vaadin-lumo-styles/style';

const theme = document.createElement('dom-module');
theme.id = 'vcf-masked-text-field-lumo';
theme.setAttribute('theme-for', 'vcf-masked-text-field');
theme.innerHTML = `
    <template>
      <style>
        :host {}
      </style>
    </template>
  `;
theme.register(theme.id);

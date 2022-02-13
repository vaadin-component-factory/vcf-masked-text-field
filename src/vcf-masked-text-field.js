/*
 * Copyright 2000-2021 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';


/**
 * `<vcf-masked-text-field>` Extension of the Vaadin Web Component that provides a masking feature.
 * Internally it uses imaskjs library.
 *
 * ```html
 * <vcf-masked-text-field></vcf-masked-text-field>
 * ```
 *
 * @memberof Vaadin
 * @extends TextFieldElement
 * @demo demo/index.html
 */

class VcfMaskedTextField extends TextFieldElement {
  static get is() {
    return 'vcf-masked-text-field';
  }

  connectedCallback() {
    super.connectedCallback();
    this.enterHandler = e => {
      if ((e.key === 'Enter' || e.keyCode === 13) || (e.key === 'Tab' || e.keyCode === 9)) {
        e.stopPropagation();
        if (this.$server) {
          let value = this.value;
          if (this.clearOnEnter) {
            this.value = "";
          }
          this.$server.onEnterPressed(value);
        }
      }
    };
    this.addEventListener('keydown', this.enterHandler);

    this.$.clearButton.addEventListener('click', this.__clearButtonWasClicked.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.enterHandler) {
      this.removeEventListener('keydown', this.enterHandler);
    }
  }

  __clearButtonWasClicked() {
    this.dispatchEvent(new CustomEvent('clearButtonClick'));
  }

  _addImaskEventListeners() {
    this.imask.on('accept', (ev) => {
      this.$server._imaskAccepted(JSON.stringify({
        maskedValue: this.imask.value,
        unmaskedValue: this.imask.unmaskedValue
      }))
    });
    this.imask.on('complete', (ev) => {
      this.$server._imaskCompleted(JSON.stringify({
        maskedValue: this.imask.value,
        unmaskedValue: this.imask.unmaskedValue
      }))
    });
  }

  _removeImaskEventListeners() {
    this.imask.off('accept');
    this.imask.off('complete');
  }

  init(options) {
    this.imask = new IMask(this.inputElement, this.generateIMaskOptions(JSON.parse(options)));
    this._addImaskEventListeners();
  }

  generateIMaskOptions(options) {
    const result = {};
    console.log(options);
    options.forEach(opt => {
      if(opt.eval) {
        eval(`result.${opt.option} = ${opt.value}`);
      } else {
        const val = `"${opt.value}"`
        Object.assign(result, JSON.parse(`{ "${opt.option}": ${val} }`))
      }
    });
    console.log(result);
    return result;
  }

  updateIMaskOptions(options) {
    this.imask.updateOptions( this.generateIMaskOptions(JSON.parse(options)) );
  }

  setMaskedValue(val) {
    console.log(val)
    this._removeImaskEventListeners()
    this.imask.value = val;
    this._addImaskEventListeners();
  }

  setUnmaskedValue(val) {
    this._removeImaskEventListeners()
    this.imask.unmaskedValue = val;
    this._addImaskEventListeners();
  }

}

customElements.define(VcfMaskedTextField.is, VcfMaskedTextField);

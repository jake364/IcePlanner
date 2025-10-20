import { LitElement, html, css } from "https://unpkg.com/lit?module";

/**
 * <number-input>
 * A reusable web component for numeric inputs with + and - buttons.
 * Emits a 'change' event with the updated numeric value.
 */
export class NumberInput extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
  };

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      flex: 1;
    }

    button {
      background-color: var(--primary-color, #1a73e8);
      color: white;
      border: none;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button:hover {
      background-color: var(--primary-hover, #155ab6);
    }

    input {
      width: 100%;
      max-width: 100px;
      text-align: center;
      padding: 0.4rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    @media (prefers-color-scheme: dark) {
      input {
        background-color: #333;
        color: #fff;
        border-color: #555;
      }

      button {
        background-color: #4aa8ff;
      }
    }
  `;

  // emit new value
  updateValue(newValue) {
    this.value = newValue < this.min ? this.min : newValue;
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }

  render() {
    return html`
      <button @click=${() => this.updateValue(this.value - 1)}>-</button>
      <input
        type="number"
        .value=${this.value.toFixed(0)}
        min=${this.min}
        step="1"
        @input=${(e) => this.updateValue(parseInt(e.target.value || 0))}
      />
      <button @click=${() => this.updateValue(this.value + 1)}>+</button>
    `;
  }
}

customElements.define("number-input", NumberInput);



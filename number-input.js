import { LitElement, html, css } from "https://unpkg.com/lit?module";

/**
 * <number-input>
 * A reusable numeric input with custom +/- buttons.
 * Emits a `change` event with the new value whenever updated.
 */
export class NumberInput extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    step: { type: Number },
  };

  static styles = css`
    .number-input-wrapper {
      display: flex;
      align-items: center;
    }
    button {
      background-color: #ddd;
      border: 1px solid #ccc;
      padding: 0 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      user-select: none;
    }
    input {
      width: 80px;
      text-align: right;
      border: 1px solid #ccc;
      border-left: none;
      border-right: none;
      padding: 0.25rem;
      -moz-appearance: textfield;
    }
    input::-webkit-inner-spin-button, input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    @media (prefers-color-scheme: dark) {
      button {
        background-color: #555;
        color: #fff;
        border-color: #888;
      }
      input {
        background-color: #333;
        color: #fff;
        border-color: #555;
      }
    }
  `;

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.step = 1;
  }

  // Increment value and emit change
  increment() {
    this.value += this.step;
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }

  // Decrement value, respecting min, and emit change
  decrement() {
    this.value = Math.max(this.value - this.step, this.min);
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }

  // Handle manual input change
  handleInput(e) {
    this.value = parseFloat(e.target.value) || this.min;
    if (this.value < this.min) this.value = this.min;
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }

  render() {
    return html`
      <div class="number-input-wrapper">
        <button @click=${this.decrement}>-</button>
        <input type="number" .value=${String(this.value)} @input=${this.handleInput.bind(this)} min=${this.min} />
        <button @click=${this.increment}>+</button>
      </div>
    `;
  }
}

customElements.define("number-input", NumberInput);


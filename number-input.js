import { LitElement, html, css } from "https://unpkg.com/lit?module";

/**
 * <number-input>
 * Reusable numeric input with accessible +/- buttons.
 * Props:
 *  - value (Number): current value
 *  - min (Number): minimum allowed (default 0)
 *  - step (Number): increment step (default 1)
 *  - disabled (Boolean): when true, hides +/- buttons and disables manual edits
 *
 * Emits:
 *  - 'change' CustomEvent with detail = new numeric value
 *
 * Notes:
 *  - Works with .value property binding (use .value=${...})
 *  - Buttons have aria-labels for accessibility
 */
export class NumberInput extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean }
  };

  static styles = css`
    :host { display:inline-block; font-family: inherit; }
    .wrap {
      display:flex;
      align-items:center;
      border-radius:8px;
      overflow:hidden;
      background:var(--number-bg, #fff);
      box-shadow: var(--number-boxshadow, none);
    }
    button {
      all:unset;
      cursor:pointer;
      padding:0 10px;
      height:2.5rem;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border-right:1px solid rgba(0,0,0,0.06);
      border-left:1px solid rgba(0,0,0,0.06);
      background:var(--number-btn-bg, #f0f0f0);
      color:var(--number-btn-color, #111);
      user-select:none;
    }
    button:active { transform: translateY(1px); }
    input[type="number"]{
      border: none;
      width:120px;
      padding:0 10px;
      height:2.5rem;
      text-align:right;
      font-size:1rem;
      background:transparent;
      outline:none;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    /* disabled style to visually match other boxes */
    .readonly {
      background:var(--number-readonly-bg, #eee);
      color:var(--number-readonly-color, #111);
      height:2.5rem;
      display:flex;
      align-items:center;
      justify-content:flex-end;
      padding:0 10px;
      width:120px;
      box-sizing:border-box;
      border-radius:8px;
    }
    @media (prefers-color-scheme: dark) {
      .wrap { background: #2b2b2b; }
      button { background:#444; color:#fff; border-right:1px solid rgba(255,255,255,0.04); border-left:1px solid rgba(255,255,255,0.04); }
      input[type="number"]{ color:#fff; }
      .readonly { background:#333; color:#fff; }
    }
  `;

  constructor(){
    super();
    this.value = 0;
    this.min = 0;
    this.step = 1;
    this.disabled = false;
  }

  // internal helper to emit change
  _emit() {
    const v = Number(this.value) || 0;
    this.dispatchEvent(new CustomEvent('change', { detail: v, bubbles:true, composed:true }));
  }

  // increment by step
  increment(){
    this.value = Number(this.value || 0) + Number(this.step || 1);
    this._emit();
    this.requestUpdate();
  }

  // decrement respecting min
  decrement(){
    const newVal = Number(this.value || 0) - Number(this.step || 1);
    this.value = Math.max(newVal, Number(this.min || 0));
    this._emit();
    this.requestUpdate();
  }

  // handle manual input
  onInput(e){
    if(this.disabled) return;
    const v = parseFloat(e.target.value);
    this.value = Number.isFinite(v) ? v : this.min;
    if(this.value < this.min) this.value = this.min;
    this._emit();
  }

  render(){
    // disabled: render a readonly box (no +/-)
    if(this.disabled){
      return html`<div class="readonly" aria-disabled="true">${String(this.value)}</div>`;
    }

    return html`
      <div class="wrap" role="group" aria-label="number input">
        <button @click=${this.decrement} aria-label="Decrease value" title="Decrease">−</button>
        <input
          type="number"
          .value=${String(this.value)}
          .min=${this.min}
          .step=${this.step}
          @input=${this.onInput}
          aria-valuemin=${this.min}
          aria-valuenow=${this.value}
        />
        <button @click=${this.increment} aria-label="Increase value" title="Increase">+</button>
      </div>
    `;
  }
}

customElements.define('number-input', NumberInput);



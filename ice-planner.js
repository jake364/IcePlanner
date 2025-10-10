import { LitElement, html, css } from "https://unpkg.com/lit?module";

export class IcePlanner extends LitElement {
  static properties = {
    teamName: { type: String },
    iceHours: { type: Number },
    iceCost: { type: Number },
    coachCost: { type: Number },
    numPlayers: { type: Number },
    jerseyQuantity: { type: Number },
    jerseyCost: { type: Number },
    feePercent: { type: Number },
    subtotal: { type: Number },
    total: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      padding: 1rem;
      max-width: 650px;
      margin: auto;
      background-color: #f5f5f5;
      color: #222;
      border-radius: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    header {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    header h1 {
      font-size: 2rem;
      margin: 0;
    }
    .description {
      font-size: 1rem;
      margin-bottom: 1rem;
      text-align: center;
      color: #555;
    }
    .input-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      gap: 0.5rem;
    }
    .input-row label {
      flex: 1;
    }
    .number-input-wrapper {
      display: flex;
      align-items: center;
    }
    .number-input-wrapper button {
      background-color: #ddd;
      border: 1px solid #ccc;
      padding: 0 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      user-select: none;
    }
    .number-input-wrapper input {
      width: 80px;
      text-align: right;
      border: 1px solid #ccc;
      border-left: none;
      border-right: none;
      padding: 0.25rem;
      -moz-appearance: textfield;
    }
    /* remove default number input arrows */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .indent {
      margin-left: 1.5rem;
    }
    .indent-more {
      margin-left: 3rem;
    }
    .results {
      margin-top: 1rem;
      border-top: 1px solid #ccc;
      padding-top: 1rem;
    }
    .total {
      font-weight: bold;
      font-size: 1.2rem;
      margin-top: 0.5rem;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        background-color: #1e1e1e;
        color: #ddd;
      }
      input {
        background-color: #333;
        color: #fff;
        border-color: #555;
      }
      .number-input-wrapper button {
        background-color: #555;
        color: #fff;
        border-color: #888;
      }
    }
  `;

  constructor() {
    super();
    this.teamName = "";
    this.iceHours = 50;
    this.iceCost = 300;
    this.coachCost = 3000;
    this.numPlayers = 1;
    this.jerseyQuantity = this.numPlayers;
    this.jerseyCost = 88;
    this.feePercent = 2;
    this.subtotal = 0;
    this.total = 0;
    this.updateTotals();
  }

  updateTotals() {
    if (this.jerseyQuantity < this.numPlayers) this.jerseyQuantity = this.numPlayers;
    const iceTotal = this.iceHours * this.iceCost;
    const jerseyTotal = this.jerseyQuantity * this.jerseyCost;
    this.subtotal = iceTotal + this.coachCost + jerseyTotal;
    const fees = this.subtotal * (this.feePercent / 100);
    this.total = this.subtotal + fees;
  }

  handleInput(e, field) {
    this[field] = parseFloat(e.target.value) || 0;
    this.updateTotals();
  }

  handleTextInput(e, field) {
    this[field] = e.target.value;
  }

  // Custom +/- buttons
  increment(field, step = 1) {
    this[field] += step;
    this.updateTotals();
  }

  decrement(field, step = 1, min = 0) {
    this[field] = Math.max(this[field] - step, min);
    this.updateTotals();
  }

  renderNumberInput(field, value, min = 0) {
    return html`
      <div class="number-input-wrapper">
        <button @click=${() => this.decrement(field, 1, min)}>-</button>
        <input type="number" .value=${String(value)} @input=${e => this.handleInput(e, field)} min=${min} />
        <button @click=${() => this.increment(field, 1)}>+</button>
      </div>
    `;
  }

  render() {
    return html`
      <header>
        <h1>Ice Planner</h1>
        🏒
      </header>

      <p class="description">
        Calculate your team’s hockey season costs — ice time, coaching, jerseys, and percentage fees — and see total and per-player breakdowns.
      </p>

      <!-- Team Name -->
      <div class="input-row">
        <label>Team Name:</label>
        <input type="text" .value=${this.teamName} @input=${e => this.handleTextInput(e, "teamName")} />
      </div>

      <!-- Ice Hours -->
      <div class="input-row">
        <label>Ice Hours:</label>
        ${this.renderNumberInput("iceHours", this.iceHours, 0)}
      </div>
      <div class="input-row indent">
        <label>Ice Cost ($/hour):</label>
        ${this.renderNumberInput("iceCost", this.iceCost, 0)}
      </div>

      <!-- Coach -->
      <div class="input-row">
        <label>Coach Cost ($):</label>
        ${this.renderNumberInput("coachCost", this.coachCost, 0)}
      </div>

      <!-- Number of Players -->
      <div class="input-row">
        <label>Number of Players:</label>
        ${this.renderNumberInput("numPlayers", this.numPlayers, 1)}
      </div>

      <!-- Jersey Quantity -->
      <div class="input-row indent">
        <label>Jersey Quantity:</label>
        ${this.renderNumberInput("jerseyQuantity", this.jerseyQuantity, this.numPlayers)}
      </div>
      <div class="input-row indent-more">
        <label>Jersey Cost ($/jersey):</label>
        ${this.renderNumberInput("jerseyCost", this.jerseyCost, 0)}
      </div>

      <!-- Fees -->
      <div class="input-row">
        <label>Transaction Fee (%):</label>
        ${this.renderNumberInput("feePercent", this.feePercent, 0)}
      </div>

      <!-- Results -->
      <div class="results">
        <div>Subtotal: $${this.subtotal.toFixed(2)}</div>
        <div>+ Fees (${this.feePercent}%):</div>
        <div class="total">Total: $${this.total.toFixed(2)}</div>
        <div>Per Player: $${(this.total / this.numPlayers).toFixed(2)}</div>
      </div>
    `;
  }
}

customElements.define("ice-planner", IcePlanner);



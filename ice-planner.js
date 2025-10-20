import { LitElement, html, css } from "https://unpkg.com/lit?module";
import "./number-input.js";

/**
 * IcePlanner Web Component
 * Calculates total hockey team costs
 * based on ice hours, coach cost, jersey costs, and transaction fees.
 */
export class IcePlanner extends LitElement {
  static properties = {
    teamName: { type: String },
    iceHours: { type: Number },
    iceCost: { type: Number },
    coachCost: { type: Number },
    numPlayers: { type: Number },
    jerseyCost: { type: Number },
    feePercent: { type: Number },
    fixedFee: { type: Number },
    subtotal: { type: Number },
    total: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 700px;
      background: var(--card-bg, #fff);
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--primary-color, #1a73e8);
    }

    .description {
      text-align: center;
      color: var(--secondary-color, #555);
      margin-bottom: 1.5rem;
    }

    .input-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .indent {
      margin-left: 1.5rem;
    }
    .indent-more {
      margin-left: 3rem;
    }

    number-input {
      width: 120px;
    }

    .readonly-box {
      width: 120px;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      background-color: #eee;
      text-align: center;
      font-weight: 600;
    }

    .results {
      margin-top: 2rem;
      text-align: center;
      background: var(--result-bg, #e8f0fe);
      border-radius: 0.75rem;
      padding: 1rem 1.5rem;
      font-weight: 600;
    }

    .total {
      color: var(--primary-color, #1a73e8);
      font-size: 1.4rem;
      margin-top: 0.5rem;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --card-bg: #2c2c2c;
        --primary-color: #4aa8ff;
        --secondary-color: #aaa;
        --result-bg: #333844;
        color: #eee;
      }

      .readonly-box {
        background-color: #444;
        border-color: #666;
        color: #fff;
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
    this.jerseyCost = 88;
    this.feePercent = 2;
    this.fixedFee = 0.99;
    this.subtotal = 0;
    this.total = 0;
    this.updateTotals();
  }

  updateTotals() {
    const jerseyQuantity = this.numPlayers;
    const iceTotal = this.iceHours * this.iceCost;
    const jerseyTotal = jerseyQuantity * this.jerseyCost;
    this.subtotal = iceTotal + this.coachCost + jerseyTotal;
    const fees = this.subtotal * (this.feePercent / 100) + this.fixedFee;
    this.total = this.subtotal + fees;
  }

  handleNumberChange(field, value) {
    this[field] = value;
    this.updateTotals();
  }

  handleTextInput(e) {
    this.teamName = e.target.value;
  }

  render() {
    return html`
      <header>
        <h1>Ice Planner</h1> 🏒
      </header>

      <p class="description">
        Plan your team’s hockey season costs — ice time, coaching, jerseys, and fees.
      </p>

      <div class="input-row">
        <label>Team Name:</label>
        <input
          type="text"
          .value=${this.teamName}
          @input=${this.handleTextInput.bind(this)}
        />
      </div>

      <div class="input-row">
        <label>Ice Hours:</label>
        <number-input
          .value=${this.iceHours}
          min="0"
          @change=${(e) => this.handleNumberChange("iceHours", e.detail)}
        ></number-input>
      </div>

      <div class="input-row indent">
        <label>Ice Cost ($/hour):</label>
        <number-input
          .value=${this.iceCost}
          min="0"
          @change=${(e) => this.handleNumberChange("iceCost", e.detail)}
        ></number-input>
      </div>

      <div class="input-row">
        <label>Coach Cost ($):</label>
        <number-input
          .value=${this.coachCost}
          min="0"
          @change=${(e) => this.handleNumberChange("coachCost", e.detail)}
        ></number-input>
      </div>

      <div class="input-row">
        <label>Number of Players:</label>
        <number-input
          .value=${this.numPlayers}
          min="1"
          @change=${(e) => this.handleNumberChange("numPlayers", e.detail)}
        ></number-input>
      </div>

      <div class="input-row indent">
        <label>Jersey Quantity:</label>
        <div class="readonly-box">${this.numPlayers}</div>
      </div>

      <div class="input-row indent-more">
        <label>Jersey Cost ($/jersey):</label>
        <number-input
          .value=${this.jerseyCost}
          min="0"
          @change=${(e) => this.handleNumberChange("jerseyCost", e.detail)}
        ></number-input>
      </div>

      <div class="input-row">
        <label>Transaction Fee (%):</label>
        <number-input
          .value=${this.feePercent}
          min="0"
          @change=${(e) => this.handleNumberChange("feePercent", e.detail)}
        ></number-input>
      </div>

      <div class="results">
        <div>Subtotal: $${this.subtotal.toFixed(2)}</div>
        <div>+ Fees (${this.feePercent}% + $${this.fixedFee.toFixed(2)}):</div>
        <div class="total">Total: $${this.total.toFixed(2)}</div>
        <div>Per Player: $${(this.total / this.numPlayers).toFixed(2)}</div>
      </div>
    `;
  }
}

customElements.define("ice-planner", IcePlanner);






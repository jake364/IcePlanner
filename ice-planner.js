import { LitElement, html, css } from "https://unpkg.com/lit?module";
import "./number-input.js";

/**
 * IcePlanner Web Component
 * ------------------------
 * A hockey budget planner app that calculates total and per-player costs
 * based on configurable parameters: ice hours, cost per hour, coaches, jerseys, etc.
 *
 * - Uses reusable <number-input> web component
 * - Jersey quantity automatically equals number of players
 * - Supports dark mode and responsive design
 * - All numeric values are rounded to two decimal places
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
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      max-width: 700px;
      margin: 2rem auto;
      background-color: var(--bg-color, #f5f5f5);
      color: var(--text-color, #222);
      border-radius: 1rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      padding: 2rem 1.5rem;
    }

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    header h1 {
      font-size: 2.2rem;
      margin: 0;
      font-weight: 700;
      color: var(--primary-color, #1a73e8);
    }

    .description {
      text-align: center;
      color: var(--secondary-color, #555);
      margin-bottom: 1.5rem;
    }

    .card {
      background: var(--card-bg, #fff);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .input-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .input-row label {
      font-weight: 600;
    }

    .indent {
      margin-left: 1.5rem;
    }

    .indent-more {
      margin-left: 3rem;
    }

    number-input {
      width: 130px;
    }

    .readonly-box {
      width: 130px;
      padding: 0.5rem;
      text-align: right;
      background-color: #e0e0e0;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      font-weight: 600;
    }

    .results {
      background-color: var(--result-bg, #e8f0fe);
      border-radius: 0.75rem;
      padding: 1rem 1.5rem;
      font-weight: 600;
      font-size: 1.1rem;
      margin-top: 1.5rem;
      text-align: center;
    }

    .total {
      font-size: 1.4rem;
      color: var(--primary-color, #1a73e8);
      margin-top: 0.5rem;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --bg-color: #1e1e1e;
        --text-color: #eee;
        --card-bg: #2c2c2c;
        --result-bg: #333844;
        --primary-color: #4aa8ff;
        --secondary-color: #aaa;
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

  /** Round numbers to 2 decimal places to avoid floating-point errors */
  round(value) {
    return Math.round(value * 100) / 100;
  }

  /** Recalculate subtotal, total, and per-player costs */
  updateTotals() {
    const jerseyQuantity = this.numPlayers;
    const iceTotal = this.iceHours * this.iceCost;
    const jerseyTotal = jerseyQuantity * this.jerseyCost;
    this.subtotal = this.round(iceTotal + this.coachCost + jerseyTotal);
    const fees = this.round(this.subtotal * (this.feePercent / 100) + this.fixedFee);
    this.total = this.round(this.subtotal + fees);
  }

  /** Handle number-input changes */
  handleNumberChange(field, value) {
    this[field] = this.round(value);
    this.updateTotals();
  }

  /** Handle text input for team name */
  handleTextInput(e) {
    this.teamName = e.target.value;
  }

  render() {
    return html`
      <header>
        <h1>Ice Planner</h1> 🏒
      </header>

      <p class="description">
        Plan your team’s hockey season costs — ice time, coaching, jerseys, and fees — with per-player breakdowns.
      </p>

      <div class="card">
        <div class="input-row">
          <label>Team Name:</label>
          <input type="text" .value=${this.teamName} @input=${this.handleTextInput.bind(this)} />
        </div>

        <div class="input-row">
          <label>Ice Hours:</label>
          <number-input .value=${this.iceHours} min="0" @change=${e => this.handleNumberChange("iceHours", e.detail)}></number-input>
        </div>

        <div class="input-row indent">
          <label>Ice Cost ($/hour):</label>
          <number-input .value=${this.iceCost} min="0" @change=${e => this.handleNumberChange("iceCost", e.detail)}></number-input>
        </div>

        <div class="input-row">
          <label>Coach Cost ($):</label>
          <number-input .value=${this.coachCost} min="0" @change=${e => this.handleNumberChange("coachCost", e.detail)}></number-input>
        </div>

        <div class="input-row">
          <label>Number of Players:</label>
          <number-input .value=${this.numPlayers} min="1" @change=${e => this.handleNumberChange("numPlayers", e.detail)}></number-input>
        </div>

        <div class="input-row indent">
          <label>Jersey Quantity:</label>
          <div class="readonly-box">${this.numPlayers}</div>
        </div>

        <div class="input-row indent-more">
          <label>Jersey Cost ($/jersey):</label>
          <number-input .value=${this.jerseyCost} min="0" @change=${e => this.handleNumberChange("jerseyCost", e.detail)}></number-input>
        </div>

        <div class="input-row">
          <label>Transaction Fee (%):</label>
          <number-input .value=${this.feePercent} min="0" @change=${e => this.handleNumberChange("feePercent", e.detail)}></number-input>
        </div>

        <div class="input-row">
          <label>Fixed Fee ($):</label>
          <number-input .value=${this.fixedFee} min="0" @change=${e => this.handleNumberChange("fixedFee", e.detail)}></number-input>
        </div>
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




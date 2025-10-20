import { LitElement, html, css } from "lit";

export class IcePlanner extends LitElement {
  static properties = {
    teamName: { type: String },
    iceCost: { type: Number },
    iceHours: { type: Number },
    coachCost: { type: Number },
    jerseyCost: { type: Number },
    numPlayers: { type: Number },
    transactionPercent: { type: Number },
    fixedFee: { type: Number },
    totalCost: { type: Number },
    costPerPlayer: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 20px auto;
      background-color: var(--ddd-theme-surface, #fff);
      color: var(--ddd-theme-on-surface, #000);
      border-radius: 16px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      padding: 20px;
      transition: background-color 0.3s, color 0.3s;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    .field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
    }

    .field label {
      flex: 1;
      text-align: left;
    }

    .field input {
      flex: 0 0 150px;
      text-align: right;
      padding: 5px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1em;
    }

    .result {
      text-align: center;
      margin-top: 20px;
      font-size: 1.2em;
      font-weight: bold;
    }

    button {
      display: block;
      margin: 20px auto 0;
      background-color: var(--ddd-theme-primary, #0078d4);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: var(--ddd-theme-primary-dark, #005fa3);
    }
  `;

  constructor() {
    super();
    this.teamName = "";
    this.iceCost = 0;
    this.iceHours = 0;
    this.coachCost = 0;
    this.jerseyCost = 0;
    this.numPlayers = 1;
    this.transactionPercent = 0;
    this.fixedFee = 0;
    this.totalCost = 0;
    this.costPerPlayer = 0;
  }

  round(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  updateField(field, e) {
    this[field] = parseFloat(e.target.value) || 0;
  }

  calculateCost() {
    const iceTotal = this.iceCost * this.iceHours;
    const jerseysTotal = this.jerseyCost * this.numPlayers;
    const subtotal = iceTotal + this.coachCost + jerseysTotal;
    const transactionFee = subtotal * (this.transactionPercent / 100) + this.fixedFee;
    const total = subtotal + transactionFee;
    const perPlayer = this.numPlayers > 0 ? total / this.numPlayers : 0;

    // Round values to avoid float precision issues
    this.totalCost = this.round(total);
    this.costPerPlayer = this.round(perPlayer);
    this.iceCost = this.round(this.iceCost);
    this.iceHours = this.round(this.iceHours);
    this.coachCost = this.round(this.coachCost);
    this.jerseyCost = this.round(this.jerseyCost);
    this.transactionPercent = this.round(this.transactionPercent);
    this.fixedFee = this.round(this.fixedFee);

    this.requestUpdate();
  }

  render() {
    return html`
      <h2>🏒 Ice Planner</h2>

      <div class="field">
        <label>Team Name</label>
        <input type="text" .value=${this.teamName} @input=${e => this.updateField("teamName", e)} />
      </div>

      <div class="field">
        <label>Ice Cost ($/hour)</label>
        <input type="number" step="0.01" .value=${this.iceCost} @input=${e => this.updateField("iceCost", e)} />
      </div>

      <div class="field">
        <label>Ice Hours</label>
        <input type="number" step="0.1" .value=${this.iceHours} @input=${e => this.updateField("iceHours", e)} />
      </div>

      <div class="field">
        <label>Coach Cost ($)</label>
        <input type="number" step="0.01" .value=${this.coachCost} @input=${e => this.updateField("coachCost", e)} />
      </div>

      <div class="field">
        <label>Jersey Cost ($/jersey)</label>
        <input type="number" step="0.01" .value=${this.jerseyCost} @input=${e => this.updateField("jerseyCost", e)} />
      </div>

      <div class="field">
        <label>Number of Players</label>
        <input type="number" min="1" .value=${this.numPlayers} @input=${e => this.updateField("numPlayers", e)} />
      </div>

      <div class="field">
        <label>Transaction Fee (%)</label>
        <input type="number" step="0.01" .value=${this.transactionPercent} @input=${e => this.updateField("transactionPercent", e)} />
      </div>

      <div class="field">
        <label>Fixed Fee ($)</label>
        <input type="number" step="0.01" .value=${this.fixedFee} @input=${e => this.updateField("fixedFee", e)} />
      </div>

      <button @click=${this.calculateCost}>Calculate</button>

      <div class="result">Total Cost: $${this.totalCost.toFixed(2)}</div>
      <div class="result">Cost per Player: $${this.costPerPlayer.toFixed(2)}</div>
    `;
  }
}

customElements.define("ice-planner", IcePlanner);




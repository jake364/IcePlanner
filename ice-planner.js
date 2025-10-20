import { LitElement, html, css } from "https://unpkg.com/lit?module";
import "./number-input.js";



/**
 * ice-planner
 * Main application component:
 * - Uses <number-input> for numeric inputs
 * - Jersey quantity mirrors number of players and is displayed in a read-only box
 * - Includes fixed fee (0.99) plus percentage fee
 * - Saves state to localStorage, can Reset, and can produce a shareable URL
 * - Accessible (aria-live for results, aria-labels), responsive and supports dark mode
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
    /* DDD-like tokens (you can map these to your real DDD token names) */
    :host {
      --ddd-bg: var(--ddd-bg, #f5f5f5);
      --ddd-surface: var(--ddd-surface, #fff);
      --ddd-text: var(--ddd-text, #222);
      --ddd-accent: var(--ddd-accent, #1a73e8);
      --ddd-muted: var(--ddd-muted, #555);

      display:block;
      font-family: 'Segoe UI', Tahoma, Roboto, Arial, sans-serif;
      padding: 2rem 1rem;
      max-width: 760px;
      margin: 2rem auto;
      background: var(--ddd-bg);
      color: var(--ddd-text);
      box-sizing: border-box;
    }

    .wrapper {
      background: var(--ddd-surface);
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 8px 24px rgba(10,10,10,0.06);
    }

    header {
      display:flex;
      align-items:center;
      justify-content:center;
      gap:12px;
      margin-bottom:12px;
    }
    header h1 { margin:0; font-size:1.9rem; color:var(--ddd-accent); }
    .description { text-align:center; color:var(--ddd-muted); margin-bottom:16px; }

    .card { padding:16px; background:transparent; border-radius:8px; }
    .input-row { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; }
    .input-row label { flex:0 0 auto; font-weight:600; color:var(--ddd-text); }

    /* Make all boxes a fixed width and aligned to far right */
    number-input,
    .readonly-box,
    input[type="text"] {
      flex: 0 0 140px;
      text-align: right;
    }

    /* textbox styling for team name (keeps width aligned to others) */
    input[type="text"] {
      height:40px;
      padding:8px 10px;
      border-radius:8px;
      border:1px solid rgba(0,0,0,0.08);
      box-sizing:border-box;
    }

    /* jersey readonly box styled to visually match number-input box */
    .readonly-box {
      height: 40px;
      display:flex;
      align-items:center;
      justify-content:flex-end;
      padding-right:10px;
      border-radius:8px;
      background: #eee;
      border: 1px solid rgba(0,0,0,0.08);
      font-weight:700;
    }

    /* control row for actions */
    .controls { display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }

    button {
      appearance:none;
      border:none;
      background:var(--ddd-accent);
      color:white;
      padding:8px 12px;
      border-radius:8px;
      cursor:pointer;
      font-weight:600;
    }
    button.secondary {
      background:transparent;
      color:var(--ddd-accent);
      border:1px solid rgba(26,115,232,0.12);
    }

    .results {
      margin-top:14px;
      padding:12px;
      border-radius:8px;
      background:rgba(26,115,232,0.06);
      text-align:center;
      font-weight:700;
    }
    .results .total { margin-top:6px; font-size:1.2rem; color:var(--ddd-accent); }

    @media (prefers-color-scheme:dark) {
      :host {
        --ddd-bg: #0f1114;
        --ddd-surface: #111214;
        --ddd-text: #e6eef8;
        --ddd-accent: #4aa8ff;
        --ddd-muted: #9aa8bf;
      }
      .wrapper { box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
      input[type="text"] { background:#151718; color:var(--ddd-text); border-color:rgba(255,255,255,0.04); }
      .readonly-box { background:#222; color:var(--ddd-text); border-color:rgba(255,255,255,0.04); }
    }

    /* Small screens: labels stack above boxes */
    @media (max-width:520px) {
      .input-row { flex-direction:column; align-items:stretch; gap:8px; }
      number-input, .readonly-box, input[type="text"] { flex: 1 1 auto; width:100%; text-align:right; }
      .controls { justify-content:stretch; }
    }
  `;

  constructor(){
    super();
    // defaults
    this.teamName = "";
    this.iceHours = 50;
    this.iceCost = 300;
    this.coachCost = 3000;
    this.numPlayers = 1;
    this.jerseyCost = 88;
    this.feePercent = 2;
    this.fixedFee = 0.99; // fixed transaction fee required by spec
    this.subtotal = 0;
    this.total = 0;

    // try load from URL or localStorage in connectedCallback
  }

  connectedCallback(){
    super.connectedCallback();
    // try load state from URL first (share link), then fallback to localStorage
    const fromUrl = this._loadStateFromURL();
    if(!fromUrl) this._loadStateFromStorage();
    this.updateTotals();
  }
      // Helper function for rounding to two decimal places
      roundToTwo(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
      }
      /**
       * Handle numeric input changes
       * @param {string} field - property name to update
       * @param {number} value - new value from input
       */
      handleNumberChange(field, value) {
        // Round input values to 2 decimals
        this[field] = this.roundToTwo(value);
        this.updateTotals();
      }
  /**
   * Recalculate totals
   * fee = percent of subtotal + fixedFee
   */
  updateTotals(){
  const jerseyQuantity = this.numPlayers; // Jersey quantity = number of players
   const iceTotal = this.roundToTwo(this.iceHours * this.iceCost);
  const jerseyTotal = this.roundToTwo(jerseyQuantity * this.jerseyCost);
  this.subtotal = this.roundToTwo(iceTotal + this.coachCost + jerseyTotal);
    const coach = Number(this.coachCost) || 0;
    const fees = this.roundToTwo(this.subtotal * (this.feePercent / 100) + this.fixedFee);
     this.total = this.roundToTwo(this.subtotal + fees);
    // save state to localStorage whenever totals update
    this._saveStateToStorage();
  }

  /**
   * Generic handler for number-input 'change' events
   * field: string property name; value: numeric value from child
   */
  handleNumberChange(field, value){
    this[field] = value;
    // if number of players changed, jersey quantity mirrors it (no separate prop)
    // update totals and persist
    this.updateTotals();
  }

  handleTextInput(e){
    this.teamName = e.target.value;
    this._saveStateToStorage();
  }

  /* -------------------------
     Persistence: localStorage
     ------------------------- */
  _saveStateToStorage(){
    try{
      const state = {
        teamName: this.teamName,
        iceHours: this.iceHours,
        iceCost: this.iceCost,
        coachCost: this.coachCost,
        numPlayers: this.numPlayers,
        jerseyCost: this.jerseyCost,
        feePercent: this.feePercent,
        fixedFee: this.fixedFee
      };
      localStorage.setItem('ice-planner-state', JSON.stringify(state));
    }catch(e){}
  }

  _loadStateFromStorage(){
    try {
      const raw = localStorage.getItem('ice-planner-state');
      if(!raw) return false;
      const s = JSON.parse(raw);
      Object.assign(this, s);
      this.updateTotals();
      return true;
    } catch(e) { return false; }
  }

  /* -------------------------
     Share: encode/decode state in URL
     ------------------------- */
  _serializeStateToURL(){
    const state = {
      teamName: this.teamName,
      iceHours: this.iceHours,
      iceCost: this.iceCost,
      coachCost: this.coachCost,
      numPlayers: this.numPlayers,
      jerseyCost: this.jerseyCost,
      feePercent: this.feePercent,
      fixedFee: this.fixedFee
    };
    try {
      const encoded = btoa(JSON.stringify(state));
      const url = `${location.origin}${location.pathname}?s=${encodeURIComponent(encoded)}`;
      // update browser URL without reload
      history.replaceState(null, '', `?s=${encodeURIComponent(encoded)}`);
      return url;
    } catch(e){ return null; }
  }

  _loadStateFromURL(){
    try {
      const params = new URLSearchParams(location.search);
      if(!params.has('s')) return false;
      const decoded = JSON.parse(atob(decodeURIComponent(params.get('s'))));
      Object.assign(this, decoded);
      this.updateTotals();
      return true;
    } catch(e){
      return false;
    }
  }

  /* Reset to defaults (and clear storage & URL) */
  reset(){
    localStorage.removeItem('ice-planner-state');
    history.replaceState(null, '', location.pathname);
    this.teamName = "";
    this.iceHours = 50;
    this.iceCost = 300;
    this.coachCost = 3000;
    this.numPlayers = 1;
    this.jerseyCost = 88;
    this.feePercent = 2;
    this.fixedFee = 0.99;
    this.updateTotals();

  }



  async copyShareLink(){
    const url = this._serializeStateToURL();
    if(!url) { alert("Failed to create share link"); return; }
    try {
      await navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard");
    } catch(e){
      // fallback: open url in new tab
      window.open(url, '_blank');
    }
  }

  /* -------------------------
     Template / rendering
     ------------------------- */
  render(){
    return html`
      <div class="wrapper" role="application" aria-label="Ice planner application">
        <header>
          <h1>Ice Planner</h1>
          <span aria-hidden="true">🏒</span>
        </header>

        <div class="description">
          Plan your team’s hockey season costs — ice time, coaching, jerseys, and fees — with per-player breakdowns.
        </div>

        <div class="card" role="region" aria-label="Inputs">
          <!-- Team Name -->
          <div class="input-row">
            <label for="team">Team Name</label>
            <input id="team" type="text" .value=${this.teamName} @input=${this.handleTextInput.bind(this)} aria-label="Team name"/>
          </div>

          <!-- Ice hours -->
          <div class="input-row">
            <label>Ice Hours</label>
            <number-input .value=${this.iceHours} min=0 @change=${e => this.handleNumberChange('iceHours', e.detail)}></number-input>
          </div>

          <!-- Ice cost (indented) -->
          <div class="input-row indent">
            <label>Ice Cost ($/hour)</label>
            <number-input .value=${this.iceCost} min=0 step=0.01 @change=${e => this.handleNumberChange('iceCost', e.detail)}></number-input>
          </div>

          <!-- Coach -->
          <div class="input-row">
            <label>Coach Cost ($)</label>
            <number-input .value=${this.coachCost} min=0 step=1 @change=${e => this.handleNumberChange('coachCost', e.detail)}></number-input>
          </div>

          <!-- Number of players -->
          <div class="input-row">
            <label>Number of Players</label>
            <number-input .value=${this.numPlayers} min=1 step=1 @change=${e => this.handleNumberChange('numPlayers', e.detail)}></number-input>
          </div>

          <!-- Jersey Quantity (read-only, mirrors players) -->
          <div class="input-row indent">
            <label>Jersey Quantity</label>
            <!-- show same box width as number-input but not editable -->
            <div class="readonly-box" aria-readonly="true" aria-label="Jersey quantity">${this.numPlayers}</div>
          </div>

          <!-- Jersey Cost -->
          <div class="input-row indent-more">
            <label>Jersey Cost ($/jersey)</label>
            <number-input .value=${this.jerseyCost} min=0 step=0.01 @change=${e => this.handleNumberChange('jerseyCost', e.detail)}></number-input>
          </div>

          <!-- Transaction fees: percent + fixed -->
          <div class="input-row">
            <label>Transaction Fee (%)</label>
            <number-input .value=${this.feePercent} min=0 step=0.1 @change=${e => this.handleNumberChange('feePercent', e.detail)}></number-input>
          </div>
          <div class="input-row">
            <label>Fixed Fee ($)</label>
            <number-input .value=${this.fixedFee} min=0 step=0.01 @change=${e => this.handleNumberChange('fixedFee', e.detail)}></number-input>
          </div>

          <!-- Control buttons -->
          <div class="controls" role="toolbar" aria-label="Actions">
            <button class="secondary" @click=${() => this.reset()}>Reset</button>
            <button @click=${() => this.copyShareLink()}>Copy share link</button>
          </div>
        </div>

        <!-- Results -->
        <div class="results" role="status" aria-live="polite">
          <div>Subtotal: $${(this.subtotal || 0).toFixed(2)}</div>
          <div>+ Fees (${this.feePercent}% + $${Number(this.fixedFee).toFixed(2)}):</div>
          <div class="total">Total: $${(this.total || 0).toFixed(2)}</div>
          <div>Per Player: $${( (this.total || 0) / (this.numPlayers || 1) ).toFixed(2)}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('ice-planner', IcePlanner);




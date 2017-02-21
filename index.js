function calculateLoan({ amount, apr, months }) {
  const monthlyRate = ((apr / 100) / 12);
  const monthlyRepayments = (
    monthlyRate +
    monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)
  ) * amount;
  const totalAmount = monthlyRepayments * months;
  const totalCost = totalAmount - amount;

  return {
    monthlyRepayments,
    totalAmount,
    totalCost,
  };
}

const toCurrency = number => number.toLocaleString('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

const Results = (props) => {
  const { monthlyRepayments, totalAmount, totalCost } = props;

  return (
    <div className="results">
      <p>Monthly repayments: {toCurrency(monthlyRepayments)}</p>
      <p>Total amount repayable: {toCurrency(totalAmount)}</p>
      <p>Total cost of credit: {toCurrency(totalCost)}</p>
    </div>
  );
};

class NumberField extends React.Component {
  constructor(props) {
    super(props);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }
  increment(e) {
    this.inputRef.stepUp();
    this.inputRef.dispatchEvent(new Event('input', { bubbles: true }));
  }
  decrement(e) {
    this.inputRef.stepDown();
    this.inputRef.dispatchEvent(new Event('input', { bubbles: true }));
  }
  render() {
    const { min, max, step, name, value, children, onChangeEvent } = this.props;
    return (
      <div className="form__fieldgroup">
        <label className="form__label" for={name}>{children}</label>
        <input
          className="form__field form__field--number"
          type="number"
          name={name}
          min={min}
          max={max}
          step={step}
          ref={(node) => { this.inputRef = node; }}
          onChange={onChangeEvent}
          defaultValue={value}
        />
        <div className="form__btngroup">
          <button
            className="form__btn"
            onClick={this.increment}
            type="button"
          >+</button>
          <button
            className="form__btn"
            onClick={this.decrement}
            type="button"
          >-</button>
        </div>
      </div>
    );
  }
};

const CalculatorForm = (props) => {
  const { onChangeEvent, onSubmitEvent, amount, months, apr } = props;
  //  it should never be empty, if it is, add a default number
  return (
    <form
      className="form"
      onSubmit={onSubmitEvent}
    >
      <NumberField
        name="amount"
        min={100}
        max={25000}
        step={100}
        value={amount}
        onChangeEvent={onChangeEvent}
      >Amount</NumberField>
      <NumberField
        name="months"
        min={6}
        max={240}
        step={6}
        value={months}
        onChangeEvent={onChangeEvent}
      >Term length (months)</NumberField>
      <NumberField
        name="apr"
        min={0.1}
        max={100}
        step={0.1}
        value={apr}
        onChangeEvent={onChangeEvent}
      >APR interest rate</NumberField>
    </form>
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      amount: 1000,
      apr: 5,
      months: 12,
      monthlyRepayments: 0,
      totalAmount: 0,
      totalCost: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.calculate();
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value * 1,
    }, this.calculate);
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  calculate() {
    this.setState(state => calculateLoan(state));
  }
  render() {
    return (
      <div className="app">
        <h1 className="app__title">Loan Calculator</h1>
        <CalculatorForm
          amount={this.state.amount}
          months={this.state.months}
          apr={this.state.apr}
          onChangeEvent={this.handleChange}
          onSubmitEvent={this.handleSubmit}
        />
        <p>* This calculator is for illustrative purposes only</p>
        <Results
          monthlyRepayments={this.state.monthlyRepayments}
          totalAmount={this.state.totalAmount}
          totalCost={this.state.totalCost}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

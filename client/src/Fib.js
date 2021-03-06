import React, {Component} from "react";
import axios from "axios";

class Fib extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seenIndices: [],
      values: [],
      index: "",
    };
  }

  componentDidMount() {
    this.fetchValues();
    this.fetchIndices();
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    if (values?.data) this.setState({values: values.data});
  }

  async fetchIndices() {
    const seenIndices = await axios.get("/api/values/all");
    if (Array.isArray(seenIndices?.data))
      this.setState({seenIndices: seenIndices.data});
  }

  renderSeenIndices() {
    return this.state.seenIndices.map(({number}) => number).join(", ");
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/api/values", {
      index: this.state.index,
    });

    this.setState({index: ""});
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor=''>Enter your index:</label>
          <input
            type='text'
            value={this.state.index}
            onChange={(e) => this.setState({index: e.target.value})}
          />
          <button type='submit'>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndices()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;

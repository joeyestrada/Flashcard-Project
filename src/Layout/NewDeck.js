import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

function NewDeck({ importDeckData }) {
  const history = useHistory();

  const initialState = {
    name: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    importDeckData(formData);
    history.push("/");
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create Deck
          </li>
        </ol>
      </nav>
      <h1>Create Deck</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={changeHandler}
            value={formData.name}
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            onChange={changeHandler}
            value={formData.description}
          ></textarea>
        </div>
        <Link to="/">
          <button className="btn btn-secondary mr-2">Cancel</button>
        </Link>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}

export default NewDeck;

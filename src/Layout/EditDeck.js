import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api/index";

function EditDeck() {
  const { deckId } = useParams();
  const [formData, setFormData] = useState(null);
  const [deck, setDeck] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const abort = new AbortController();

    async function getDeck() {
      try {
        const cardsFromAPI = await readDeck(deckId, abort.signal);
        setDeck(cardsFromAPI);
        setFormData(cardsFromAPI);
      } catch (error) {
        console.log(error);
      }
    }
    getDeck();
    return () => abort.abort();
  }, [deckId]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abort = new AbortController();
    await updateDeck(formData, abort.signal);
    history.push(`/decks/${deckId}`);
  };

  if (!formData) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Deck
          </li>
        </ol>
      </nav>
      <h1>Edit Deck</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Deck Name</label>
          <input
            className="form-control"
            id="name"
            name="name"
            onChange={changeHandler}
            value={formData.name}
          ></input>
        </div>
        <div className="form-group">
          <label>Deck Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            onChange={changeHandler}
            value={formData.description}
          ></textarea>
        </div>
        <Link to={`/decks/${deckId}`}>
          <button className="btn btn-secondary mr-2">Cancel</button>
        </Link>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}

export default EditDeck;

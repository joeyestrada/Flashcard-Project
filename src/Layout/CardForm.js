import React from "react";
import { Link } from "react-router-dom";

function CardForm({ changeHandler, submitHandler, formData, deckId, newCard }) {
  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label>Front</label>
        <textarea
          className="form-control"
          id="front"
          name="front"
          rows="3"
          onChange={changeHandler}
          value={formData.front}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Back</label>
        <textarea
          className="form-control"
          id="back"
          name="back"
          rows="3"
          onChange={changeHandler}
          value={formData.back}
        ></textarea>
      </div>
      <Link to={`/decks/${deckId}`}>
        {newCard && <button className="btn btn-secondary mr-3">Done</button>}
        {!newCard && <button className="btn btn-secondary mr-3">Cancel</button>}
      </Link>
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
}

export default CardForm;

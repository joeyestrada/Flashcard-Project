import React from "react";
import { Link } from "react-router-dom";

function DecksRender({ decks, deleteHandler }) {
  return decks.map((deck, index) => {
    return (
      <div key={index} className="card mb-1">
        <div className="card-body">
          <div className="row justify-content-between px-2">
            <h5 className="card-title">{deck.name}</h5>
            <h6>{deck.cards.length} cards</h6>
          </div>
          <p className="row card-text px-2">{deck.description}</p>
          <div className="row justify-content-between px-2">
            <div>
              <Link to={`/decks/${deck.id}`}>
                <button className="btn btn-secondary mr-1">
                  <i className="bi bi-eye pr-1"></i>
                  View
                </button>
              </Link>
              <Link to={`/decks/${deck.id}/study`}>
                <button className="btn btn-primary">
                  <i className="bi bi-journal-bookmark pr-1"></i>
                  Study
                </button>
              </Link>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => deleteHandler(deck.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    );
  });
}

export default DecksRender;

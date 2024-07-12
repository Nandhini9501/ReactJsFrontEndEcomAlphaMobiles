import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Cards = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4040/card/getAllCards")
      .then((response) => {
        console.log("API response:", response.data);
        setCards(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the cards!", error);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {cards.map((card) => {
        const { cardId, cardTitle, cardPrice, cardDes, cardImage } = card;

        if (!cardTitle || !cardPrice || !cardImage || !cardDes) {
          console.error("Missing required card properties", card);
          return null;
        }

        return (
          <Card key={cardId} style={{ width: "18rem", margin: "20px" }}>
            <Card.Img
              variant="top"
              style={{ height: "250px", width: "250px" }}
              src={`http://localhost:4040/images/${cardImage}`}
              alt={cardTitle}
            />
            <Card.Body>
              <Card.Title>{cardTitle}</Card.Title>
              <Card.Text>{cardPrice}</Card.Text>
              <Card.Text>{cardDes}</Card.Text>
              <Button variant="primary">Add to Cart</Button>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Cards;

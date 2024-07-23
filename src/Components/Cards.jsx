import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const navigate = useNavigate();

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

  const addToCart = async (card, userName, userId) => {
    console.log("User ID:", userId);
    console.log("userName:", userName);
    console.log("card", card);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("userName", userName);
    formData.append("productId", card.cardId);
    formData.append("productName", card.cardTitle);
    formData.append("productPrice", card.cardPrice);
    formData.append("productDes", card.cardDes);
    formData.append("productImg", card.cardImage);
    formData.append("quantity", 1);

    try {
      const response = await axios.post(
        "http://localhost:4040/cart/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Item added to cart successfully", response.data);
      alert("Item added to cart successfully");
      setAddedToCart((prevState) => ({ ...prevState, [card.cardId]: true }));
    } catch (error) {
      console.error("There was an error adding the item to the cart!", error);
    }
  };

  const goToCart = () => {
    navigate("/addCart");
  };

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
              <Card.Text>₹  {cardPrice}</Card.Text>
              <Card.Text>{cardDes}</Card.Text>
              {addedToCart[cardId] ? (
                <Button variant="info" onClick={goToCart}>
                  Go to Cart
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    const userName = localStorage.getItem("userName");
                    const userId = localStorage.getItem("userId");
                    addToCart(card, userName, userId);
                  }}
                >
                  Add to Cart
                </Button>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Cards;

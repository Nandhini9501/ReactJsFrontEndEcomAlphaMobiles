import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddCart = () => {
  const [carts, setCarts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCartId, setCurrentCartId] = useState(null);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:4040/cart/getCartById/${userId}`)
      .then((response) => {
        setCarts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the carts!", error);
      });
  }, [userId]);

  const handleRemove = (cartId) => {
    axios
      .get(`http://localhost:4040/cart/removeProduct/${cartId}`)
      .then((response) => {
        setCarts(carts.filter((cartItem) => cartItem.cartId !== cartId));
        console.log(response);
      })
      .catch((error) => {
        console.error("There was an error removing the product!", error);
      });
  };

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity === "more") {
      setCurrentCartId(cartId);
      setCustomQuantity(
        Number(carts.find((cartItem) => cartItem.cartId === cartId).quantity)
      );
      setShowModal(true);
    } else {
      const productId = carts.find(
        (cartItem) => cartItem.cartId === cartId
      ).productId;
      updateCartQuantity(userId, productId, parseInt(newQuantity));
    }
  };

  const updateCartQuantity = (userId, productId, quantity) => {
    setLoading(true);
    axios
      .post(`http://localhost:4040/cart/updateQuantity`, null, {
        params: {
          userId,
          productId,
          quantity,
        },
      })
      .then((response) => {
        setCarts(
          carts.map((cartItem) =>
            cartItem.productId === productId
              ? { ...cartItem, quantity: String(quantity) }
              : cartItem
          )
        );
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error updating the quantity!", error);
        setLoading(false);
      });
  };

  const handleApplyCustomQuantity = () => {
    const productId = carts.find(
      (cartItem) => cartItem.cartId === currentCartId
    ).productId;
    updateCartQuantity(userId, productId, customQuantity);
    setShowModal(false);
    setCurrentCartId(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setCurrentCartId(null);
  };

  const handleShopNow = () => {
    navigate("/productPage");
  };

  return (
    <>
      <div>
        <h2>Cart Items</h2>
        {carts.length > 0 ? (
          <ul>
            {carts.map((cartItem) => {
              const productPrice =
                parseInt(cartItem.productPrice) || cartItem.productPrice;
              const quantity = Number(cartItem.quantity);
              console.log(quantity + " " + productPrice);
              const totalPrice = productPrice * quantity;

              return (
                <li key={cartItem.cartId}>
                  <p>Product Image:</p>
                  <img
                    src={`http://localhost:4040/images/${cartItem.productImg}`}
                    alt={cartItem.productName}
                    style={{ width: "300px", height: "400px" }}
                  />
                  <br />
                  <p>Product Name: {cartItem.productName}</p>
                  <p>Product description: {cartItem.productDes}</p>
                  <p>Product Price: {cartItem.productPrice}</p>
                  <p>
                    Quantity:
                    <select
                      value={cartItem.quantity > 9 ? "more" : cartItem.quantity}
                      onChange={(e) =>
                        handleQuantityChange(cartItem.cartId, e.target.value)
                      }
                      disabled={loading}
                    >
                      {[1, 2, 3].map((qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                      <option value="more">More</option>
                    </select>
                  </p>
                  <p>Total Price: {totalPrice}</p>
                  <button onClick={() => handleRemove(cartItem.cartId)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <p>Your cart is empty.</p>
            <button onClick={handleShopNow}>Shop Now</button>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(Number(e.target.value))}
                min="1"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApplyCustomQuantity}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCart;

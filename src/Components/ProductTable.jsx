import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import editImg from "../assets/Image/edit-icon.svg";
import viewImg from "../assets/Image/view.png";
import deleteImg from "../assets/Image/delete.svg";
import saveImg from "../assets/Image/save.png";
import closeImg from "../assets/Image/close.svg";
import add from "../assets/Image/add.png";
import AdminNav from "./AdminNav"

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    cardId: "",
    cardTitle: "",
    cardPrice: "",
    cardDes:"",
    cardImage: "",
  });
  const [productToDelete, setProductToDelete] = useState(null);

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    cardTitle: "",
    cardPrice: "",
    cardDes:"",
    cardImage: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4040/card/getAllCards"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleShowEdit = (product) => {
    setCurrentProduct(product);
    setShowEdit(true);
  };

  const handleShowView = (product) => {
    console.log("PRODUCT+++++++++++++",product);
    setCurrentProduct(product);
    setShowView(true);
  };

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseView = () => setShowView(false);
  const handleCloseDeleteConfirm = () => setShowDeleteConfirm(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSave = async () => {
    try {
      let imageUrl = currentProduct.cardImage;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const productData = {
        ...currentProduct,
        image: imageUrl,
      };

      if (currentProduct.cardId) {
        await axios.post(
          `http://localhost:4040/card/editCard/${currentProduct.cardId}`,
          productData
        );
      } else {
        await axios.post("http://localhost:4040/card/createCard", productData);
      }

      setShowEdit(false);
      fetchUsers();
    } catch (error) {
      console.log("Error saving products", error);
    }
  };

  const handleShowDeleteConfirm = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.get(`http://localhost:4040/card/deleteCard/${productToDelete.cardId}`);
      fetchUsers();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting products", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:4040/card/uploadImg`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image Uploaded");
      return res.data;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("file", newProduct.image);

    try {
      const response = await axios.post(
        `http://localhost:4040/card/addCard`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Card created successfully", response.data);
      setShowAddProductModal(false);
      fetchUsers();
    } catch (error) {
      console.error("There was an error creating the card!", error);
    }
  };

  return (
    <>
      <AdminNav/>
      <Button
        variant="dark"
        size="sm"
        onClick={() => setShowAddProductModal(true)}
        style={{ margin: "2%", marginLeft: "7%" }}
      >
        Add Product
      </Button>

      <div>
        <Table striped bordered hover className="container">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Product Name</th>
              <th className="text-center">Product Price</th>
              <th className="text-center">Product Description</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.cardId}>
                <td scope="row">{index + 1}</td>
                <td className="text-center">{product.cardTitle}</td>
                <td className="text-center">{product.cardPrice}</td>
                <td className="text-center">{product.cardDes}</td>
                <td className="text-center">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleShowEdit(product)}
                  >
                    <img
                      src={editImg}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                  {"  "}
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleShowView(product)}
                  >
                    <img
                      src={viewImg}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                  {"  "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteConfirm(product)}
                  >
                    <img
                      src={deleteImg}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Modal */}
        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentProduct.id ? "Edit Product" : "Add Product"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="cardTitle"
                  value={currentProduct.cardTitle}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formprice" className="mt-3">
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                  type="text"
                  name="cardPrice"
                  value={currentProduct.cardPrice}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formdescription" className="mt-3">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  type="text"
                  name="cardDes"
                  value={currentProduct.cardDes}
                  onChange={handleChange}
                />
              </Form.Group>

              <div>
                <br />
                <label>Product Image</label>
                <br />
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ marginLeft: "30%" }}
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              <img src={closeImg} style={{ width: "20px", height: "20px" }} />
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              <img src={saveImg} style={{ width: "20px", height: "20px" }} />
            </Button>
          </Modal.Footer>
        </Modal>

        {/* View Modal */}
        <Modal show={showView} onHide={handleCloseView}>
          <Modal.Header closeButton>
            <Modal.Title>View Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="cardTitle"
                  value={currentProduct.cardTitle}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                  type="text"
                  name="cardPrice"
                  value={currentProduct.cardPrice}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                  type="text"
                  name="cardDes"
                  value={currentProduct.cardDes}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formProductImage" className="mt-3">
                <Form.Label>Product Image</Form.Label>
                <br />
                <img
                  src={`http://localhost:4040/images/${currentProduct.cardImage}`}
                  alt={currentProduct.cardTitle}
                  style={{ width: "50%", height: "auto" }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseView}>
              <img src={closeImg} style={{ width: "20px", height: "20px" }} />
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Product Modal */}
        <Modal
          show={showAddProductModal}
          onHide={() => setShowAddProductModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddProduct}>
              <Form.Group controlId="formProductTitle">
                <Form.Label>Card Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter card title"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="formProductPrice" className="mt-3">
                <Form.Label>Card Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter card price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="formProductPrice" className="mt-3">
                <Form.Label>Card Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter card Description"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="formProductImage" className="mt-3">
                <Form.Label>Card Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddProduct}>
              <img src={add} style={{ width: "20px", height: "20px" }} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowAddProductModal(false)}
            >
              <img src={closeImg} style={{ width: "20px", height: "20px" }} />
            </Button>
          </Modal.Footer>
        </Modal>

        {/*Delete Modal*/}

        <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the product 
            {productToDelete?.cardTitle}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
              Cancel
            </Button>
            <Button variant="danger" 
            onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal> 
      </div>
      
    </>
  );
};

export default ProductTable;

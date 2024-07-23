import Carousel from "react-bootstrap/Carousel";

const ImageCarousel = () => {
  return (
    <>
      <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px" }}
            src="./Carousel/Fold4_Carousel_GroupKV_PC.webp"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px" }}
            src="./Carousel/hero-image.webp"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px" }}
            src="./Carousel/maxresdefault.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "400px" }}
            src="./Carousel/superdayroadshow-carousel01.webp"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </>
  );
};
export default ImageCarousel;

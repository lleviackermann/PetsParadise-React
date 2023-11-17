import images from './foodservicesLandingPage/images'

const Features = () => {
    return (
        <section className="features" id="features">
      <h1 className="heading">Our <span>features</span></h1>
      <div className="box-container">
        <div className="box">
          <img
            src={images.features.fea1}
            style={{width: "200px"}}
          />
          <h3>healthy and nutritious</h3>
          <p>
            Complete and balanced daily food for dogs and cats, plant based, OGM
            free, drug residue-free, and no gluten formula.
          </p>
          <a href="#" className="btn">read more</a>
        </div>

        <div className="box">
        <img
            src={images.features.fea2}
            style={{width: "200px"}}
          />
          <h3>Doctors recommended brands</h3>
          <p>
            All the food brands we present to you are doctors recommended
            brands.
          </p>
          <a href="#" className="btn">read more</a>
        </div>

        <div className="box">
        <img
            src={images.features.fea3}
            style={{width: "200px"}}
          />
          <h3>easy payment</h3>
          <p>
            We provide a user friendly interface which is easy to understand,
            and make your experience better than ever.
          </p>
          <a href="#" className="btn">read more</a>
        </div>
      </div>
    </section>
    );
}

export default Features;
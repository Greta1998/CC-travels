import './AboutUs.css'

const AboutUs = () => {
  const values = [
    {
      title: 'Clarity & Transparency',
      description: 'Clear, honest communication so our clients feel informed and confident at every stage of their journey.'
    },
    {
      title: 'Reliability',
      description: 'We do what we promise and provide consistent, dependable support from planning to return.'
    },
    {
      title: 'Respect',
      description: 'We respect our clients\' time, needs, and budgets, while honoring people, places, and cultures.'
    },
    {
      title: 'Care in the Details',
      description: 'Attention to detail that makes every trip smooth, well-organized, and stress-free.'
    },
    {
      title: 'Responsible Travel',
      description: 'We promote thoughtful, well-planned travel that creates meaningful experiences.'
    }
  ]

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About CC Express Travel & Tours</h1>
        <p className="about-subtitle">Your trusted partner for seamless travel experiences</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            CC Express Travel & Tours Ltd is a Rwanda-based travel agency dedicated to creating seamless, reliable, and memorable travel experiences. We specialize in personalized travel planning, tour packages, and travel support for both local and international destinations.
          </p>
          <p>
            At CC Express Travel & Tours, we believe travel should be simple, well-organized, and stress-free. Our approach combines professionalism, attention to detail, and a deep understanding of our clients' needs to deliver journeys that are enjoyable from start to finish.
          </p>
        </section>

        <div className="about-grid">
          <section className="about-card vision-card">
            <div className="card-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become a trusted and respected travel agency in Rwanda, recognized for excellence, integrity, and meaningful travel experiences that connect people to the world, and the world to Africa.
            </p>
          </section>

          <section className="about-card mission-card">
            <div className="card-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To provide high-quality, affordable, and personalized travel solutions by offering reliable planning, excellent customer service, and carefully selected travel partners, while promoting tourism within Rwanda and beyond.
            </p>
          </section>
        </div>

        <section className="about-section values-section">
          <h2>Our Values</h2>
          <p className="values-intro">
            Our core values guide everything we do and shape how we serve our clients:
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUs

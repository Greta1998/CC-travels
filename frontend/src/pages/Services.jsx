import { Link } from 'react-router-dom'
import './Services.css'

const Services = () => {

  const services = [
    {
      icon: '✈',
      title: 'Flight Booking',
      description: 'Book domestic and international flights with competitive prices. We work with major airlines to provide you with the best deals and flexible options for your travel needs.',
      features: [
        'Best price guarantee',
        'Multiple airline options',
        '24/7 booking support',
        'Flexible cancellation policies'
      ]
    },
    {
      icon: '🚗',
      title: 'Car Rental',
      description: 'Rent a car for your travels with ease. We offer a wide selection of vehicles from economy to luxury, ensuring you find the perfect ride for your journey.',
      features: [
        'Wide vehicle selection',
        'Competitive rates',
        'Insurance options',
        'Pick-up and drop-off services'
      ]
    },
    {
      icon: '🏨',
      title: 'Accommodation',
      description: 'Find the perfect place to stay during your travels. From budget-friendly hotels to luxury resorts, we help you book accommodations that suit your preferences and budget.',
      features: [
        'Hotels & resorts',
        'Budget to luxury options',
        'Best available rates',
        'Convenient locations'
      ]
    },
    {
      icon: '📋',
      title: 'Visa Application',
      description: 'Simplify your visa application process with our expert assistance. We guide you through the requirements and help ensure your application is complete and accurate.',
      features: [
        'Expert guidance',
        'Document preparation',
        'Application tracking',
        'Multiple destination support'
      ]
    },
    {
      icon: '🗺️',
      title: 'Itinerary Planning',
      description: 'Let us create a customized travel itinerary tailored to your interests, budget, and schedule. We plan every detail so you can focus on enjoying your journey.',
      features: [
        'Customized plans',
        'Local insights',
        'Activity recommendations',
        'Budget optimization'
      ]
    },
    {
      icon: '🌍',
      title: 'Tour Packages',
      description: 'Discover amazing destinations with our carefully curated tour packages. From adventure tours to cultural experiences, we offer packages that create unforgettable memories.',
      features: [
        'Curated experiences',
        'Group and private tours',
        'Local guides',
        'All-inclusive options'
      ]
    }
  ]

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>Our Services</h1>
        <p className="services-subtitle">Comprehensive travel solutions tailored to your needs</p>
      </div>

      <div className="services-content">
        <div className="services-intro">
          <h2>What We Offer</h2>
          <p className="services-description">
            At CC Express Travel & Tours, we provide a full range of travel services to make your journey seamless and enjoyable. 
            From booking flights and accommodations to planning complete itineraries, we're here to handle all your travel needs.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="service-description">
                {service.description}
              </p>
              <ul className="service-features">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h2>Ready to Plan Your Next Adventure?</h2>
          <p>Contact us today to discuss your travel needs and let us help you create the perfect journey.</p>
          <Link to="/contact-us" className="cta-button">Get In Touch</Link>
        </div>
      </div>
    </div>
  )
}

export default Services

import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const services = [
    { name: 'Flight booking', path: '/flight-booking' },
    { name: 'Car rental', path: '/services' },
    { name: 'Accommodation', path: '/services' },
    { name: 'Visa application', path: '/services' },
    { name: 'Itinerary planning', path: '/services' }
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Our Services</h3>
          <ul>
            {services.map((service, index) => (
              <li key={index}>
                <Link to={service.path}>{service.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <a href="tel:+250794766253">📞 +250794766253</a>
            </li>
            <li>
              <a href="mailto:info@cctravels.org">✉️ info@cctravels.org</a>
            </li>
            <li>
              <a href="https://www.instagram.com/luxury__express_tours?igsh=dnM1amg0YWNvc241&utm_source=qr" target="_blank" rel="noopener noreferrer" className="instagram-link">
                <svg className="instagram-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                luxury_express_tours
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/flight-booking">Flight Booking</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Working Hours</h3>
          <ul>
          <li>
              <span>24/7 Online Support</span>
            </li>
            <li>
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </li>
            <li>
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </li>
            <li>
              <span>Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CC Travels & Tours. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

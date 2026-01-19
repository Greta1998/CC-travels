import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLinkClick = () => {
    closeMenu()
    // Scroll to top when clicking a link
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          <img src="/logo.png" alt="CC Travels Logo" className="logo-image" />
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={isMenuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className={`navbar-link ${isActive('/')}`} onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about-us" className={`navbar-link ${isActive('/about-us')}`} onClick={handleLinkClick}>
              About us
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/flight-booking" className={`navbar-link ${isActive('/flight-booking')}`} onClick={handleLinkClick}>
              Flight booking
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/services" className={`navbar-link ${isActive('/services')}`} onClick={handleLinkClick}>
              Services
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact-us" className={`navbar-link ${isActive('/contact-us')}`} onClick={handleLinkClick}>
              Contact us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

import { useRef, useState, useEffect } from 'react'
import Slideshow from '../components/Slideshow'
import { API_URL } from '../config/api'
import './Home.css'
import rwandairLogo from '../airlines/RwandAir.png'
import ethiopianLogo from '../airlines/ethiopian.png'
import kenyaLogo from '../airlines/kenya.png'
import qatarLogo from '../airlines/Qatar.png'
import turkishLogo from '../airlines/turkish.png'
import brusselsLogo from '../airlines/brussels.png'
import klmLogo from '../airlines/klm.png'
import egyptairLogo from '../airlines/egyptair.png'

const Home = () => {
  const airlinesScrollRef = useRef(null)
  const servicesScrollRef = useRef(null)
  const [formData, setFormData] = useState({
    tripType: 'round',
    departure: '',
    destinations: [''],
    departureDate: '',
    returnDate: '',
    adults: 1,
    kids: 0,
    customerEmail: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [departureSuggestions, setDepartureSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState({})

  // Common airports and cities list
  const airportsList = [
    { code: 'KGL', name: 'Kigali International Airport', city: 'Kigali', country: 'Rwanda' },
    { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia' },
    { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' },
    { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
    { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
    { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },
    { code: 'AMS', name: 'Amsterdam Schiphol Airport', city: 'Amsterdam', country: 'Netherlands' },
    { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { code: 'MAD', name: 'Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
    { code: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy' },
    { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
    { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },
    { code: 'DAR', name: 'Julius Nyerere International Airport', city: 'Dar es Salaam', country: 'Tanzania' },
    { code: 'EBB', name: 'Entebbe International Airport', city: 'Entebbe', country: 'Uganda' },
    { code: 'KRT', name: 'Khartoum International Airport', city: 'Khartoum', country: 'Sudan' },
    { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria' },
    { code: 'ACC', name: 'Kotoka International Airport', city: 'Accra', country: 'Ghana' },
    { code: 'DKR', name: 'Blaise Diagne International Airport', city: 'Dakar', country: 'Senegal' },
    { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco' },
  ]

  const searchAirports = (query) => {
    if (!query || query.length < 2) return []
    const lowerQuery = query.toLowerCase()
    return airportsList.filter(airport => 
      airport.code.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery) ||
      airport.country.toLowerCase().includes(lowerQuery)
    ).slice(0, 5)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'departure') {
      const suggestions = searchAirports(value)
      setDepartureSuggestions(suggestions)
      setShowDepartureSuggestions(value.length > 0 && suggestions.length > 0)
    }
  }

  const handleDestinationInputChange = (index, value) => {
    handleDestinationChange(index, value)
    const suggestions = searchAirports(value)
    setDestinationSuggestions(prev => ({
      ...prev,
      [index]: suggestions
    }))
    setShowDestinationSuggestions(prev => ({
      ...prev,
      [index]: value.length > 0 && suggestions.length > 0
    }))
  }

  const selectAirport = (airport, fieldName, index = null) => {
    const displayValue = `${airport.city} (${airport.code})`
    if (fieldName === 'departure') {
      setFormData(prev => ({ ...prev, departure: displayValue }))
      setShowDepartureSuggestions(false)
    } else {
      handleDestinationChange(index, displayValue)
      setShowDestinationSuggestions(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...formData.destinations]
    newDestinations[index] = value
    setFormData(prev => ({
      ...prev,
      destinations: newDestinations
    }))
  }

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, '']
    }))
  }

  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      const newDestinations = formData.destinations.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        destinations: newDestinations
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch(`${API_URL}/api/book-flight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: 'info@cctravels.org' // Receiving email (your business email)
        }),
      })

      if (response.ok) {
        setSubmitMessage('Thank you! Your flight booking request has been submitted successfully.')
        setFormData({
          tripType: 'round',
          departure: '',
          destinations: [''],
          departureDate: '',
          returnDate: '',
          adults: 1,
          kids: 0,
          customerEmail: '',
          description: ''
        })
      } else {
        setSubmitMessage('There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (submitMessage && submitMessage.includes('successfully')) {
      const timer = setTimeout(() => {
        setSubmitMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitMessage])
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
      title: 'Beautiful Beaches'
    },
    {
      url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=1200&q=80',
      title: 'Majestic Elephants'
    },
    {
      url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80',
      title: 'Adventure Flights'
    },
    {
      url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
      title: 'Wild Giraffes'
    }
  ]

  const services = [
    { name: 'Flight booking', icon: '✈' },
    { name: 'Car rental', icon: '🚗' },
    { name: 'Accommodation', icon: '🏨' },
    { name: 'Visa application', icon: '📋' },
    { name: 'Itinerary planning', icon: '🗺' },
    { name: 'Tour packages', icon: '🌍' }
  ]

  const airlines = [
    { 
      name: 'RwandaAir', 
      logo: rwandairLogo
    },
    { 
      name: 'Ethiopian Airlines', 
      logo: ethiopianLogo
    },
    { 
      name: 'Kenya Airways', 
      logo: kenyaLogo
    },
    { 
      name: 'Qatar Airways', 
      logo: qatarLogo
    },
    { 
      name: 'Turkish Airlines', 
      logo: turkishLogo
    },
    { 
      name: 'Brussels Airlines', 
      logo: brusselsLogo
    },
    { 
      name: 'KLM', 
      logo: klmLogo
    },
    { 
      name: 'EgyptAir', 
      logo: egyptairLogo
    }
  ]

  return (
    <div className="home-page">
      <div className="home-hero">
        <Slideshow images={images} interval={5000} />
      </div>
      <div className="services-section">
        <h2>Services Offered</h2>
        <div className="services-container-centered">
          <div className="services-grid-centered">
            {services.map((service, index) => (
              <div key={index} className="service-card-circle">
                <div className="service-icon-large">{service.icon}</div>
                <p className="service-name">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="airlines-section">
        <h2>Airlines We Work With</h2>
        <div className="airlines-container">
          <button 
            className="airlines-nav-btn prev-btn"
            onClick={() => {
              if (airlinesScrollRef.current) {
                airlinesScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
              }
            }}
            aria-label="Previous airlines"
          >
            ‹
          </button>
          <div className="airlines-grid" ref={airlinesScrollRef}>
            {airlines.map((airline, index) => (
              <div key={index} className="airline-card">
                <img 
                  src={airline.logo} 
                  alt={airline.name} 
                  className="airline-logo"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <button 
            className="airlines-nav-btn next-btn"
            onClick={() => {
              if (airlinesScrollRef.current) {
                airlinesScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
              }
            }}
            aria-label="Next airlines"
          >
            ›
          </button>
        </div>
      </div>
      <div className="booking-section">
        <h2>Book Your Flight</h2>
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Trip Type *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="tripType"
                  value="round"
                  checked={formData.tripType === 'round'}
                  onChange={handleInputChange}
                  required
                />
                <span>Round Trip</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={formData.tripType === 'one-way'}
                  onChange={handleInputChange}
                />
                <span>One-Way</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tripType"
                  value="multi-city"
                  checked={formData.tripType === 'multi-city'}
                  onChange={handleInputChange}
                />
                <span>Multi-City</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="departure">Departure From *</label>
            <div className="autocomplete-wrapper">
              <input
                type="text"
                id="departure"
                name="departure"
                value={formData.departure}
                onChange={handleInputChange}
                onFocus={() => {
                  if (formData.departure) {
                    const suggestions = searchAirports(formData.departure)
                    setDepartureSuggestions(suggestions)
                    setShowDepartureSuggestions(suggestions.length > 0)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowDepartureSuggestions(false), 200)
                }}
                placeholder="City or Airport"
                required
                autoComplete="off"
              />
              {showDepartureSuggestions && departureSuggestions.length > 0 && (
                <div className="autocomplete-suggestions">
                  {departureSuggestions.map((airport, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => selectAirport(airport, 'departure')}
                    >
                      <div className="suggestion-main">
                        <strong>{airport.city}</strong> ({airport.code})
                      </div>
                      <div className="suggestion-sub">{airport.name}, {airport.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {formData.tripType === 'multi-city' ? (
            <div className="form-group">
              <label>Destinations *</label>
              {formData.destinations.map((destination, index) => (
                <div key={index} className="destination-input-group">
                  <div className="autocomplete-wrapper">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => handleDestinationInputChange(index, e.target.value)}
                      onFocus={() => {
                        if (destination) {
                          const suggestions = searchAirports(destination)
                          setDestinationSuggestions(prev => ({ ...prev, [index]: suggestions }))
                          setShowDestinationSuggestions(prev => ({ ...prev, [index]: suggestions.length > 0 }))
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowDestinationSuggestions(prev => ({ ...prev, [index]: false }))
                        }, 200)
                      }}
                      placeholder={`Destination ${index + 1}`}
                      required
                      autoComplete="off"
                    />
                    {showDestinationSuggestions[index] && destinationSuggestions[index]?.length > 0 && (
                      <div className="autocomplete-suggestions">
                        {destinationSuggestions[index].map((airport, idx) => (
                          <div
                            key={idx}
                            className="suggestion-item"
                            onClick={() => selectAirport(airport, 'destination', index)}
                          >
                            <div className="suggestion-main">
                              <strong>{airport.city}</strong> ({airport.code})
                            </div>
                            <div className="suggestion-sub">{airport.name}, {airport.country}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDestination(index)}
                      className="remove-destination-btn"
                      aria-label="Remove destination"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDestination}
                className="add-destination-btn"
              >
                + Add Another Destination
              </button>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="destination">Destination *</label>
              <div className="autocomplete-wrapper">
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destinations[0]}
                  onChange={(e) => handleDestinationInputChange(0, e.target.value)}
                  onFocus={() => {
                    if (formData.destinations[0]) {
                      const suggestions = searchAirports(formData.destinations[0])
                      setDestinationSuggestions(prev => ({ ...prev, 0: suggestions }))
                      setShowDestinationSuggestions(prev => ({ ...prev, 0: suggestions.length > 0 }))
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowDestinationSuggestions(prev => ({ ...prev, 0: false }))
                    }, 200)
                  }}
                  placeholder="City or Airport"
                  required
                  autoComplete="off"
                />
                {showDestinationSuggestions[0] && destinationSuggestions[0]?.length > 0 && (
                  <div className="autocomplete-suggestions">
                    {destinationSuggestions[0].map((airport, idx) => (
                      <div
                        key={idx}
                        className="suggestion-item"
                        onClick={() => selectAirport(airport, 'destination', 0)}
                      >
                        <div className="suggestion-main">
                          <strong>{airport.city}</strong> ({airport.code})
                        </div>
                        <div className="suggestion-sub">{airport.name}, {airport.country}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="departureDate">Departure Date *</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {formData.tripType !== 'one-way' && (
              <div className="form-group">
                <label htmlFor="returnDate">Return Date *</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  required={formData.tripType !== 'one-way'}
                  min={formData.departureDate}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adults">Adults *</label>
              <input
                type="number"
                id="adults"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="kids">Kids</label>
              <input
                type="number"
                id="kids"
                name="kids"
                value={formData.kids}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Your Email *</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Additional Preferences</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Any special requests or preferences..."
              rows="4"
            />
          </div>

          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Home

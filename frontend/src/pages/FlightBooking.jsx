import { useState, useEffect } from 'react'
import './FlightBooking.css'

const FlightBooking = () => {
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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/book-flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: 'info@cctravels.org'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setSubmitMessage(data.message || 'Thank you! Your flight booking request has been submitted successfully.')
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
        const errorData = await response.json().catch(() => ({}))
        setSubmitMessage(errorData.message || 'There was an error submitting your request. Please try again.')
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setSubmitMessage('Request timed out. Please check your connection and try again.')
      } else if (error.message.includes('ECONNRESET') || error.message.includes('Failed to fetch')) {
        setSubmitMessage('Connection error. Please make sure the server is running and try again.')
      } else {
        setSubmitMessage(`Error: ${error.message || 'There was an error submitting your request. Please try again.'}`)
      }
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

  return (
    <div className="flight-booking-page">
      <div className="flight-booking-hero">
        <h1>Book Your Flight</h1>
        <p>Fill out the form below and we'll get back to you with the best flight options for your journey.</p>
      </div>

      <div className="booking-section">
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

      <div className="instagram-deals-section">
        <div className="instagram-deals-content">
          <div className="instagram-icon-wrapper">
            <svg className="instagram-icon-large" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h2>Explore Amazing Travel Deals</h2>
          <p>We have some amazing travel deals that you can explore on our Instagram page. Follow us to stay updated with the latest offers, destinations, and travel tips!</p>
          <a 
            href="https://www.instagram.com/luxury__express_tours?igsh=dnM1amg0YWNvc241&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-link-btn"
          >
            Visit Our Instagram
            <svg className="instagram-icon-btn" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default FlightBooking

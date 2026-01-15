import './App.css'

function App() {
  const data = [
    {
      id: 1,
      title: "Mount Fuji",
      location: "Japan",
      googleMapsUrl: "https://goo.gl/maps/1DGM5WrWnATgkSNB8",
      startDate: "12 Jan, 2021",
      endDate: "24 Jan, 2021",
      description: "Mount Fuji is the tallest mountain in Japan, standing at 3,776 meters (12,380 feet). Mount Fuji is the single most popular tourist site in Japan, for both Japanese and foreign tourists.",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Sydney Opera House",
      location: "Australia",
      googleMapsUrl: "https://goo.gl/maps/681n4jdijgdt3u8x6",
      startDate: "27 May, 2021",
      endDate: "8 Jun, 2021",
      description: "The Sydney Opera House is a multi-venue performing arts centre in Sydney. Located on the banks of the Sydney Harbour, it is often regarded as one of the 20th century's most famous and distinctive buildings",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Geirangerfjord",
      location: "Norway",
      googleMapsUrl: "https://goo.gl/maps/5J6N5Y7vK8vJ8Y5z7",
      startDate: "01 Oct, 2021",
      endDate: "18 Nov, 2021",
      description: "The Geiranger Fjord is a fjord in the Sunnmøre region of Møre og Romsdal county, Norway. It is located entirely in the Stranda Municipality.",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"
    }
  ]

  return (
    <div className="App">
      <header className="header">
        <h1>My Travel Journal</h1>
      </header>
      <main>
        {data.map(item => (
          <div key={item.id} className="card">
            <img src={item.imageUrl} alt={item.title} className="card-image" />
            <div className="card-content">
              <div className="card-location">
                <span className="location-icon">📍</span>
                <span className="location-name">{item.location}</span>
                <a href={item.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="maps-link">
                  View on Google Maps
                </a>
              </div>
              <h2 className="card-title">{item.title}</h2>
              <p className="card-dates">{item.startDate} - {item.endDate}</p>
              <p className="card-description">{item.description}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default App


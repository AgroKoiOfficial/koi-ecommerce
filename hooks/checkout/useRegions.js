import { useEffect, useState } from 'react';

const useRegions = () => {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [shippingId, setShippingId] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('/api/shippings/regions');
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);

  const fetchCities = async (region) => {
    try {
      const response = await fetch(`/api/shippings/getRegion?region=${region}`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    fetchCities(selectedRegion);
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);

    const selectedShipping = cities.find((city) => city.city === selectedCity);
    if (selectedShipping) {
      setShippingId(selectedShipping.id);
    } else {
      setShippingId(null);
      console.error('Shipping not found for city:', selectedCity);
    }
  };

  return { regions, region, cities, city, shippingId, handleRegionChange, handleCityChange };
};

export default useRegions;

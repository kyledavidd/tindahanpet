import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  image: string;
  description: string;
  price: number;
};

export default function PetStore() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newPet, setNewPet] = useState<Omit<Pet, 'id'>>({
    name: '',
    species: '',
    breed: '',
    gender: '',
    image: '',
    description: '',
    price: 0,
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/david/pets');
        setPets(response.data);
        setError(null);
      } catch (err) {
        setError('NO PETS AVAILABLE.');
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPet(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/david/pets', newPet);
      setPets([...pets, response.data]);
      setNewPet({
        name: '',
        species: '',
        breed: '',
        gender: '',
        image: '',
        description: '',
        price: 0,
      });
    } catch (error) {
      console.error('Error adding pet', error);
    }
  };

  const handleDeletePet = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/david/pets/${id}`);
      setPets(pets.filter(pet => pet.id !== id));
    } catch (error) {
      console.error('Error deleting pet', error);
    }
  };

  const handleEditPet = async (id: number) => {
    alert(`Edit functionality for pet with ID: ${id} is not yet implemented.`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Pet Store</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search pets..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px', // Adjust as needed
          fontSize: '1.5em',
          fontWeight: 'bold',
          color: 'red',
          textAlign: 'center'
        }}>
          {error}
        </div>
      ) : (
        <div className="pet-list">
          {filteredPets.map(pet => (
            <div className="pet-card" key={pet.id}>
              <img src={pet.image} alt={pet.name} />
              <h3>{pet.name}</h3>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Gender:</strong> {pet.gender}</p>
              <p><strong>Description:</strong> {pet.description}</p>
              <p><strong>Price:</strong> ${pet.price}</p>
              <button className="edit-btn" onClick={() => handleEditPet(pet.id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDeletePet(pet.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div className="add-pet-form">
        <h2>Add a Pet</h2>
        <form onSubmit={handleAddPet}>
          <input name="name" placeholder="Name" value={newPet.name} onChange={handleInputChange} required />
          <input name="species" placeholder="Species" value={newPet.species} onChange={handleInputChange} required />
          <input name="breed" placeholder="Breed" value={newPet.breed} onChange={handleInputChange} required />
          <input name="gender" placeholder="Gender" value={newPet.gender} onChange={handleInputChange} required />
          <input name="image" placeholder="Image URL" value={newPet.image} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Description" value={newPet.description} onChange={handleInputChange} required />
          <input name="price" type="number" placeholder="Price" value={newPet.price} onChange={handleInputChange} required />
          <button type="submit">Add Pet</button>
        </form>
      </div>
    </div>
  );
}
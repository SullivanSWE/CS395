
document.addEventListener('DOMContentLoaded', function() {
  // Fetch all cards when the page loads
  fetchCards();
});

// Function to fetch all cards from the backend
async function fetchCards() {
  try {
    const response = await fetch('http://localhost:3000/api/cards'); // Changed port to 3000
    const cards = await response.json();
    
    // Clear existing cards (except the template)
    const cardElements = document.querySelectorAll('.card:not(#ogCard)');
    cardElements.forEach(card => card.remove());
    
    // Hide the original template card
    document.getElementById('ogCard').style.display = 'none';
    
    // Create new cards from the data
    cards.forEach(card => {
      createCardElement(card);
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
}

// Function to create a card element from data
function createCardElement(card) {
  // Get the original card as a template
  const template = document.getElementById('ogCard');
  
  // Clone it
  const newCard = template.cloneNode(true);
  
  // Give the clone a unique ID
  newCard.id = 'card-' + card._id;
  newCard.style.display = 'block';
  
  // Update name
  const nameElement = newCard.getElementsByClassName('name')[0];
  if (nameElement) {
    nameElement.textContent = card.name;
  }
  
  // Update bio
  const bioElement = newCard.getElementsByClassName('bio')[0];
  if (bioElement) {
    bioElement.textContent = card.about;
  }
  
  // Update social links
  const socialLinks = newCard.getElementsByClassName('social-links')[0];
  if (socialLinks) {
    const links = socialLinks.getElementsByTagName('a');
    
    // Update LinkedIn link
    if (links[0] && card.linkedInLink) {
      links[0].href = card.linkedInLink;
    }
    
    // Update Handshake link
    if (links[1] && card.handshakeLink) {
      links[1].href = card.handshakeLink;
    }
  }
  
  // Add the clone to the main element
  document.querySelector('main').appendChild(newCard);
}

// Add Card to MongoDB
async function addCard() {
  const nameValue = document.getElementById('name').value;
  const aboutValue = document.getElementById('about').value;
  const linkedInValue = document.getElementById('linkedInLink').value;
  const handshakeValue = document.getElementById('handshakeLink').value;
  
  // Validate inputs
  if (!nameValue || !aboutValue) {
    alert('Please enter at least a name and about info');
    return;
  }
  
  // Create card data object
  const cardData = {
    name: nameValue,
    about: aboutValue,
    linkedInLink: linkedInValue,
    handshakeLink: handshakeValue
  };
  
  try {
    // Send data to backend (updated port to 3000)
    const response = await fetch('http://localhost:3000/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cardData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create card');
    }
    
    // Refresh cards from the database
    fetchCards();
    
    // Clear input fields
    document.getElementById('name').value = '';
    document.getElementById('about').value = '';
    document.getElementById('linkedInLink').value = '';
    document.getElementById('handshakeLink').value = '';
    
  } catch (error) {
    console.error('Error creating card:', error);
    alert('Error creating card. Please try again.');
  }
}
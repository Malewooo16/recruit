document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const user = await loginUser(email, password);
    if (user) {
      // Store the user ID in a variable or session storage for later use
     // console.log(user)
      sessionStorage.setItem('userId', user.id);
    }
  });
  
  document.getElementById('fetchProfileButton').addEventListener('click', async () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      await fetchUserProfile(userId);
    } else {
      console.error('User ID not found. Please log in first.');
    }
  });
  
  document.getElementById('logoutButton').addEventListener('click', async () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      await logoutUser(userId);
      sessionStorage.removeItem('userId'); // Clear the user ID from storage on logout
    } else {
      console.error('User ID not found. Please log in first.');
    }
  });
  
  async function loginUser(email, password) {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include credentials (cookies) in the request
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      console.log('User logged in:', data.user);
      return data.user; // Return the user data
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }
  
  async function fetchUserProfile(userId) {
    try {
      const response = await fetch(`http://localhost:3000/api/recruits/${userId}/profile`, {
        method: 'GET',
        credentials: 'include', // Include credentials (cookies) in the request
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
  
      const data = await response.json();
      console.log('User profile:', data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }
  
  async function logoutUser(userId) {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
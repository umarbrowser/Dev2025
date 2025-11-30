// Authentication service using localStorage
export const authService = {
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  },

  register(name, email, password) {
    const users = this.getAllUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  getAllUsers() {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  },
};



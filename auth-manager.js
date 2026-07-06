// ============================================
// SISTEMA DE AUTENTICACIÓN MEJORADO
// ============================================
// 
// Características:
// - Google Sign-In (OAuth)
// - Email/Contraseña local
// - Recuperación de contraseña
// - Persistencia de sesión

class AuthenticationManager {
  constructor() {
    this.storageKey = 'petstories_users';
    this.sessionKey = 'petstories_user';
    this.resetTokenKey = 'petstories_reset_tokens';
  }

  // ========== REGISTRO ==========
  registerUser(email, password, name) {
    email = email.toLowerCase();
    const users = this.getAllUsers();

    if (users[email]) {
      throw new Error('Este email ya está registrado.');
    }

    // Hash simple (en producción usar bcrypt en backend)
    const passwordHash = this.simpleHash(password);

    users[email] = {
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      profilePicture: null,
      provider: 'email' // 'email' o 'google'
    };

    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return users[email];
  }

  // ========== LOGIN CON EMAIL ==========
  loginWithEmail(email, password) {
    email = email.toLowerCase();
    const users = this.getAllUsers();

    if (!users[email]) {
      throw new Error('Email o contraseña incorrectos.');
    }

    const user = users[email];
    const passwordHash = this.simpleHash(password);

    if (user.passwordHash !== passwordHash) {
      throw new Error('Email o contraseña incorrectos.');
    }

    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(users));

    // Crear sesión
    const session = {
      name: user.name,
      email: user.email,
      provider: 'email',
      profilePicture: user.profilePicture,
      loginTime: new Date().toISOString()
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session;
  }

  // ========== LOGIN CON GOOGLE ==========
  loginWithGoogle(googlePayload) {
    const email = googlePayload.email.toLowerCase();
    let users = this.getAllUsers();

    // Si el usuario no existe, crearlo
    if (!users[email]) {
      users[email] = {
        name: googlePayload.name,
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profilePicture: googlePayload.picture || null,
        provider: 'google',
        googleId: googlePayload.sub
      };
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } else {
      // Actualizar último login y datos de Google
      users[email].lastLogin = new Date().toISOString();
      users[email].provider = 'google';
      users[email].googleId = googlePayload.sub;
      users[email].profilePicture = googlePayload.picture || users[email].profilePicture;
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    // Crear sesión
    const session = {
      name: users[email].name,
      email: email,
      provider: 'google',
      profilePicture: users[email].profilePicture,
      loginTime: new Date().toISOString()
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session;
  }

  // ========== RECUPERACIÓN DE CONTRASEÑA ==========
  requestPasswordReset(email) {
    email = email.toLowerCase();
    const users = this.getAllUsers();

    if (!users[email]) {
      // Por seguridad, no decimos si existe o no
      throw new Error('Si el email existe, recibirás un enlace de recuperación.');
    }

    if (users[email].provider === 'google') {
      throw new Error('Esta cuenta usa Google Sign-In. No puedes cambiar la contraseña.');
    }

    // Generar token único
    const resetToken = this.generateResetToken();
    const resetTokens = JSON.parse(localStorage.getItem(this.resetTokenKey)) || {};

    resetTokens[resetToken] = {
      email: email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutos
      used: false
    };

    localStorage.setItem(this.resetTokenKey, JSON.stringify(resetTokens));

    // Retornar el token (en producción, enviarlo por email)
    return {
      token: resetToken,
      expiresIn: '15 minutos',
      resetLink: `${window.location.origin}?reset=${resetToken}`
    };
  }

  // ========== VERIFICAR TOKEN DE RESET ==========
  verifyResetToken(token) {
    const resetTokens = JSON.parse(localStorage.getItem(this.resetTokenKey)) || {};

    if (!resetTokens[token]) {
      throw new Error('Token de recuperación inválido o expirado.');
    }

    const resetData = resetTokens[token];

    // Verificar que no haya expirado
    if (new Date() > new Date(resetData.expiresAt)) {
      delete resetTokens[token];
      localStorage.setItem(this.resetTokenKey, JSON.stringify(resetTokens));
      throw new Error('Token de recuperación expirado.');
    }

    if (resetData.used) {
      throw new Error('Este token ya ha sido usado.');
    }

    return resetData.email;
  }

  // ========== CAMBIAR CONTRASEÑA CON TOKEN ==========
  resetPasswordWithToken(token, newPassword) {
    const email = this.verifyResetToken(token);
    const users = this.getAllUsers();

    if (!users[email]) {
      throw new Error('Usuario no encontrado.');
    }

    // Actualizar contraseña
    const passwordHash = this.simpleHash(newPassword);
    users[email].passwordHash = passwordHash;
    localStorage.setItem(this.storageKey, JSON.stringify(users));

    // Marcar token como usado
    const resetTokens = JSON.parse(localStorage.getItem(this.resetTokenKey)) || {};
    resetTokens[token].used = true;
    localStorage.setItem(this.resetTokenKey, JSON.stringify(resetTokens));

    return true;
  }

  // ========== CAMBIAR CONTRASEÑA (AUTENTICADO) ==========
  changePassword(email, currentPassword, newPassword) {
    email = email.toLowerCase();
    const users = this.getAllUsers();

    if (!users[email]) {
      throw new Error('Usuario no encontrado.');
    }

    const user = users[email];

    // Verificar contraseña actual
    const currentHash = this.simpleHash(currentPassword);
    if (user.passwordHash !== currentHash) {
      throw new Error('Contraseña actual incorrecta.');
    }

    // Actualizar contraseña
    const newHash = this.simpleHash(newPassword);
    user.passwordHash = newHash;
    localStorage.setItem(this.storageKey, JSON.stringify(users));

    return true;
  }

  // ========== OBTENER SESIÓN ACTUAL ==========
  getCurrentSession() {
    const session = sessionStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }

  // ========== LOGOUT ==========
  logout() {
    sessionStorage.removeItem(this.sessionKey);
  }

  // ========== FUNCIONES AUXILIARES ==========

  getAllUsers() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || {};
  }

  // Hash simple (IMPORTANTE: Esto es solo para demo, usar bcrypt en producción)
  simpleHash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  generateResetToken() {
    return 'reset_' + Math.random().toString(36).substr(2, 32) + '_' + Date.now().toString(36);
  }

  // Limpiar tokens expirados
  cleanupExpiredTokens() {
    const resetTokens = JSON.parse(localStorage.getItem(this.resetTokenKey)) || {};
    const now = new Date();

    for (const token in resetTokens) {
      if (new Date(resetTokens[token].expiresAt) < now) {
        delete resetTokens[token];
      }
    }

    localStorage.setItem(this.resetTokenKey, JSON.stringify(resetTokens));
  }

  // Obtener información del usuario
  getUserInfo(email) {
    email = email.toLowerCase();
    const users = this.getAllUsers();
    const user = users[email];

    if (!user) return null;

    // No retornar datos sensibles
    return {
      name: user.name,
      email: user.email,
      provider: user.provider,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };
  }

  // Actualizar perfil
  updateProfile(email, updates) {
    email = email.toLowerCase();
    const users = this.getAllUsers();

    if (!users[email]) {
      throw new Error('Usuario no encontrado.');
    }

    // Solo permitir actualizar ciertos campos
    if (updates.name) users[email].name = updates.name;
    if (updates.profilePicture) users[email].profilePicture = updates.profilePicture;

    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return users[email];
  }
}

// Crear instancia global
window.authManager = new AuthenticationManager();

// Limpiar tokens expirados al cargar
window.authManager.cleanupExpiredTokens();

console.log('✅ Authentication Manager cargado');

// -------- Registro --------
const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const photo = document.getElementById('photo').value || 'https://via.placeholder.com/150';
    const email = document.getElementById('emailReg').value;
    const password = document.getElementById('passwordReg').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if(users.find(u => u.email === email)){
      document.getElementById('registerError').textContent = "Email ya registrado";
      return;
    }

    users.push({name, age, gender, photo, email, password, likes: [], matches: []});
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = 'index.html';
  });
}

// -------- Login --------
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if(user){
      localStorage.setItem('loggedUser', JSON.stringify(user));
      window.location.href = 'profile.html';
    } else {
      document.getElementById('loginError').textContent = "Email o contraseña incorrectos";
    }
  });
}

// -------- Perfil --------
const profileInfo = document.getElementById('profileInfo');
if(profileInfo){
  let user = JSON.parse(localStorage.getItem('loggedUser'));
  if(!user) window.location.href = 'index.html';
  profileInfo.innerHTML = `
    <img src="${user.photo}" alt="Foto de perfil">
    <p><strong>Nombre:</strong> ${user.name}</p>
    <p><strong>Edad:</strong> ${user.age}</p>
    <p><strong>Género:</strong> ${user.gender}</p>
    <p><strong>Email:</strong> ${user.email}</p>
  `;
  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
  });
}

// -------- Usuarios y Matches --------
const usersList = document.getElementById('usersList');
const matchesList = document.getElementById('matchesList');
if(usersList){
  let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  let users = JSON.parse(localStorage.getItem('users')) || [];

  users.forEach(u => {
    if(u.email !== loggedUser.email){
      const card = document.createElement('div');
      card.className = 'userCard';
      card.innerHTML = `
        <img src="${u.photo}" alt="Foto">
        <p><strong>${u.name}</strong></p>
        <p>${u.age} años - ${u.gender}</p>
        <button class="likeBtn">Me gusta</button>
      `;
      const btn = card.querySelector('.likeBtn');
      btn.addEventListener('click', ()=>{
        if(!loggedUser.likes.includes(u.email)) loggedUser.likes.push(u.email);
        if(u.likes.includes(loggedUser.email)){
          loggedUser.matches.push(u.email);
          u.matches.push(loggedUser.email);
          alert(`¡Es un match con ${u.name}! 💖`);
        } else {
          alert(`Le diste me gusta a ${u.name}`);
        }
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        users = users.map(us => us.email === loggedUser.email ? loggedUser : us);
        localStorage.setItem('users', JSON.stringify(users));
        showMatches();
      });
      usersList.appendChild(card);
    }
  });

  function showMatches(){
    matchesList.innerHTML = '';
    const matches = users.filter(u => loggedUser.matches.includes(u.email));
    matches.forEach(m => {
      const card = document.createElement('div');
      card.className = 'userCard';
      card.innerHTML = `<img src="${m.photo}" alt="Foto"><p>${m.name}</p>`;
      matchesList.appendChild(card);
    });
  }

  showMatches();

  document.getElementById('logoutBtn2').addEventListener('click', ()=>{
    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
  });
}

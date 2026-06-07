const BASE_URL = 'http://localhost:5000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { 
    'Authorization': user ? user.id.toString() : '', 
    'Content-Type': 'application/json' 
  };
};

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data; 
  },

  register: async (username, password, role) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getPlaces: async (search = '') => {
    const res = await fetch(`${BASE_URL}/places?q=${search}`);
    if (!res.ok) throw new Error('Ошибка загрузки мест');
    return res.json();
  },

  // Вспомогательная функция для получения 1 места
  getPlaceById: async (id) => {
    const res = await fetch(`${BASE_URL}/places`);
    const data = await res.json();
    const place = data.places.find(p => p.id.toString() === id.toString());
    if (!place) throw new Error('Место не найдено');
    return place;
  },

  addPlace: async (placeData) => {
    const res = await fetch(`${BASE_URL}/admin/places`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(placeData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  buildSmartRoute: async (routeData) => {
    const res = await fetch(`${BASE_URL}/smart-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData)
    });
    if (!res.ok) throw new Error('Ошибка генерации маршрута');
    return res.json(); // Возвращает массив дней
  },

  checkIn: async (placeId) => {
    const res = await fetch(`${BASE_URL}/places/${placeId}/checkin`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    // Обновляем ачивки в LocalStorage если они пришли с бэка
    if (data.message.includes('Поздравляем')) {
        const user = JSON.parse(localStorage.getItem('user'));
        // Запрос к бэку за свежими данными юзера в реальном проекте, 
        // но здесь мы просто попросим юзера перезайти или обновим стейт
    }
    return data;
  },

  addReview: async (placeId, text) => {
    const res = await fetch(`${BASE_URL}/places/${placeId}/reviews`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  addService: async (serviceData) => {
    const res = await fetch(`${BASE_URL}/guide/services`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(serviceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  bookService: async (serviceId, date) => {
    const res = await fetch(`${BASE_URL}/services/${serviceId}/book`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ date })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  downloadReport: async (type) => {
    const res = await fetch(`${BASE_URL}/admin/reports/${type}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка скачивания');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report.${type === 'excel' ? 'xlsx' : 'pdf'}`;
    a.click();
  }
};

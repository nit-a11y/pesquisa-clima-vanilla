/*
 * Funções utilitárias auxiliares
 */

const API_BASE = window.location.origin.includes('localhost') 
  ? 'http://localhost:3001' 
  : window.location.origin;

// Parse seguro de JSON
function safeParseJSON(jsonString, defaultValue = {}) {
  try {
    return JSON.parse(jsonString || JSON.stringify(defaultValue));
  } catch {
    return defaultValue;
  }
}

// Debounce para eventos
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Animar elemento
function animateElement(element, animationClass, duration = 300) {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

// Scroll suave
function smoothScrollTo(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: elementPosition - offset,
    behavior: 'smooth'
  });
}

// Salvar no localStorage
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
}

// Carregar do localStorage
function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// Limpar localStorage
function clearStorage(key) {
  localStorage.removeItem(key);
}

// Exportar para CSV
function exportToCSV(data, filename) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Converter array para CSV
function convertToCSV(data) {
  if (!data || !data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(h => JSON.stringify(obj[h] || '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

// Verificar se é dispositivo móvel
function isMobile() {
  return window.innerWidth <= 768;
}

// Criar elemento DOM
function createElement(tag, classes = [], attributes = {}, text = '') {
  const element = document.createElement(tag);
  if (classes.length) element.classList.add(...classes);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text) element.textContent = text;
  return element;
}

// Tornar globais
window.API_BASE = API_BASE;
window.safeParseJSON = safeParseJSON;
window.debounce = debounce;
window.formatDate = formatDate;
window.animateElement = animateElement;
window.smoothScrollTo = smoothScrollTo;
window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.clearStorage = clearStorage;
window.exportToCSV = exportToCSV;
window.convertToCSV = convertToCSV;
window.isMobile = isMobile;
window.createElement = createElement;

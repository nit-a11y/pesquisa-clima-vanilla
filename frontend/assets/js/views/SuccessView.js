/*
 * View: SuccessView
 * Página de agradecimento após envio
 */

// Animação de confete
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
  const particles = [];
  
  // Criar partículas
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.5
    });
  }
  
  let animationId;
  let duration = 5000; // 5 segundos de animação
  let startTime = Date.now();
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      
      // Reposicionar partículas que saíram da tela
      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity * (1 - progress * 0.5);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    
    if (elapsed < duration) {
      animationId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  animate();
  
  // Redimensionar canvas ao redimensionar janela
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { once: true });
}

function renderSuccessView(onBackToHome) {
  // Iniciar confete após renderizar
  setTimeout(startConfetti, 100);
  return `
    <div class="success-page">
      ${renderFloatingBackground()}
      <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
      
      <main class="success-main">
        <div class="success-icon-large">
          ${icons.checkCircle.replace('width="20" height="20"', 'width="64" height="64"')}
        </div>
        
        <h1 class="success-title">Obrigado pela sua participação!</h1>
        
        <p class="success-message">
          Sua opinião é muito importante para nós. <br/>
          Juntos, vamos construir um ambiente de trabalho ainda melhor.
        </p>
        
        <div class="success-actions">
          <button onclick="${onBackToHome}()" class="btn btn-outline btn-lg">
            ${icons.home}
            Voltar ao Início
          </button>
        </div>
        
        <footer class="success-footer">
          <p>© 2026 Nordeste Locações — Núcleo de Inteligência e Tecnologia (NIT)</p>
        </footer>
      </main>
    </div>
  `;
}

window.renderSuccessView = renderSuccessView;

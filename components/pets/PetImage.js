'use client';

export default function PetImage({ pet, size = 'card' }) {
  const sizeStyles = {
    card: { width: '100%', height: '100%' },
    profile: { width: '100%', height: '100%', maxHeight: '500px' },
    thumb: { width: '50px', height: '50px' },
  };

  return (
    <div style={{ ...sizeStyles[size], position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
      <img
        src={pet.photo}
        alt={`${pet.name} - ${pet.breed}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--blue-100),var(--blue-50));display:flex;align-items:center;justify-content:center;font-size:${size === 'profile' ? '8rem' : size === 'thumb' ? '1.5rem' : '4rem'}">${pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐦'}</div>`;
        }}
      />
    </div>
  );
}

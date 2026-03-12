'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  {
    id: 'type',
    question: 'What type of pet are you looking for?',
    sub: 'Choose the companion that fits your lifestyle.',
    options: [
      { value: 'dog', icon: '🐕', label: 'Dog', desc: 'Loyal, playful, great for active families' },
      { value: 'cat', icon: '🐈', label: 'Cat', desc: 'Independent, affectionate, low maintenance' },
      { value: 'either', icon: '🐾', label: 'Either works!', desc: 'I love all animals equally' },
    ],
  },
  {
    id: 'energy',
    question: 'What\'s your energy level?',
    sub: 'Be honest — which sounds more like you?',
    options: [
      { value: 'high', icon: '🏃', label: 'Active & Adventurous', desc: 'Hiking, running, always on the go' },
      { value: 'moderate', icon: '🚶', label: 'Moderately Active', desc: 'Daily walks and weekend adventures' },
      { value: 'low', icon: '🛋️', label: 'Couch Companion', desc: 'Netflix and snuggles are more my speed' },
    ],
  },
  {
    id: 'living',
    question: 'Where do you live?',
    sub: 'This helps us match you with a pet that fits your space.',
    options: [
      { value: 'house-yard', icon: '🏡', label: 'House with Yard', desc: 'Plenty of outdoor space to play' },
      { value: 'house-no-yard', icon: '🏠', label: 'House without Yard', desc: 'Indoor space with nearby parks' },
      { value: 'apartment', icon: '🏢', label: 'Apartment/Condo', desc: 'Cozy urban living' },
      { value: 'rural', icon: '🌾', label: 'Rural Property', desc: 'Acres of freedom' },
    ],
  },
  {
    id: 'age',
    question: 'Any age preference?',
    sub: 'Every age has its own special charm.',
    options: [
      { value: 'puppy', icon: '🍼', label: 'Puppy/Kitten', desc: 'Baby energy, house training required' },
      { value: 'young', icon: '⚡', label: 'Young (1-3 years)', desc: 'Playful, somewhat trained' },
      { value: 'adult', icon: '🌟', label: 'Adult (3-7 years)', desc: 'Settled personality, usually trained' },
      { value: 'senior', icon: '🤍', label: 'Senior (7+ years)', desc: 'Calm, loving, grateful for a home' },
      { value: 'any', icon: '💕', label: 'Any age', desc: 'Love knows no age limit' },
    ],
  },
  {
    id: 'experience',
    question: 'What\'s your pet experience?',
    sub: 'There\'s no wrong answer here!',
    options: [
      { value: 'first-time', icon: '🌱', label: 'First-time Owner', desc: 'Never had a pet before — excited to start!' },
      { value: 'some', icon: '📚', label: 'Some Experience', desc: 'Had pets growing up or briefly' },
      { value: 'experienced', icon: '🏆', label: 'Very Experienced', desc: 'Lifelong pet lover, know the drill' },
    ],
  },
  {
    id: 'kids',
    question: 'Do you have children at home?',
    sub: 'This helps us find kid-friendly pets.',
    options: [
      { value: 'yes-young', icon: '👶', label: 'Yes, under 6', desc: 'Toddlers and young children' },
      { value: 'yes-older', icon: '🧒', label: 'Yes, 6+', desc: 'Older children who understand pets' },
      { value: 'no', icon: '🚫', label: 'No children', desc: 'Adults only household' },
    ],
  },
  {
    id: 'other-pets',
    question: 'Any other pets in the house?',
    sub: 'Compatibility matters!',
    options: [
      { value: 'dog', icon: '🐕', label: 'Yes, a dog', desc: 'Need a pet-friendly friend' },
      { value: 'cat', icon: '🐈', label: 'Yes, a cat', desc: 'Must be cat-compatible' },
      { value: 'both', icon: '🏠', label: 'Multiple pets', desc: 'We\'re a full house' },
      { value: 'none', icon: '✨', label: 'No other pets', desc: 'This will be our first' },
    ],
  },
];

// Simulated matching based on quiz answers
function getMatches(answers) {
  const matches = [
    { name: 'Luna', breed: 'Domestic Shorthair', type: 'cat', age: 'young', energy: 'moderate', emoji: '🐱', traits: ['Friendly', 'Playful'] },
    { name: 'Buddy', breed: 'Labrador Mix', type: 'dog', age: 'adult', energy: 'high', emoji: '🐕', traits: ['Loyal', 'Active'] },
    { name: 'Whiskers', breed: 'Tabby', type: 'cat', age: 'senior', energy: 'low', emoji: '🐱', traits: ['Gentle', 'Calm'] },
    { name: 'Max', breed: 'Beagle Mix', type: 'dog', age: 'young', energy: 'high', emoji: '🐶', traits: ['Energetic', 'Social'] },
    { name: 'Mittens', breed: 'Siamese Mix', type: 'cat', age: 'adult', energy: 'moderate', emoji: '🐱', traits: ['Vocal', 'Smart'] },
    { name: 'Rocky', breed: 'German Shepherd Mix', type: 'dog', age: 'adult', energy: 'high', emoji: '🐕', traits: ['Protective', 'Loyal'] },
    { name: 'Cleo', breed: 'Domestic Longhair', type: 'cat', age: 'puppy', energy: 'moderate', emoji: '🐱', traits: ['Curious', 'Fluffy'] },
    { name: 'Charlie', breed: 'Golden Retriever', type: 'dog', age: 'puppy', energy: 'high', emoji: '🐶', traits: ['Friendly', 'Gentle'] },
  ];

  return matches.map(pet => {
    let score = 50;
    if (answers.type === pet.type || answers.type === 'either') score += 15;
    if (answers.energy === pet.energy) score += 10;
    if (answers.age === pet.age || answers.age === 'any') score += 10;
    score += Math.floor(Math.random() * 10);
    score = Math.min(score, 98);
    return { ...pet, matchPercent: score };
  })
  .sort((a, b) => b.matchPercent - a.matchPercent)
  .slice(0, 4);
}

export default function PetMatchQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  function selectOption(value) {
    const qId = QUESTIONS[step].id;
    setAnswers(prev => ({ ...prev, [qId]: value }));

    // Auto-advance after a brief pause
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
        setAnimKey(prev => prev + 1);
      } else {
        // Show results
        const m = getMatches({ ...answers, [qId]: value });
        setMatches(m);
        setShowResults(true);
      }
    }, 300);
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      setAnimKey(prev => prev + 1);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setShowResults(false);
    setMatches([]);
    setAnimKey(prev => prev + 1);
  }

  const progress = showResults ? 100 : ((step + 1) / QUESTIONS.length) * 100;

  return (
    <section className="quiz-page">
      <div className="container">
        {!showResults ? (
          <>
            {/* Hero */}
            <div className="quiz-hero">
              <div className="quiz-hero-icon">🐾</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '8px' }}>
                Find Your <span className="text-gradient">Perfect Pet</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                Answer a few questions and we&apos;ll match you with pets that suit your lifestyle.
              </p>
            </div>

            {/* Progress */}
            <div className="quiz-progress-wrap">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="quiz-progress-text">
                <span>Question {step + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="quiz-card" key={animKey}>
              <div className="quiz-question">{QUESTIONS[step].question}</div>
              <div className="quiz-question-sub">{QUESTIONS[step].sub}</div>

              <div className="quiz-options">
                {QUESTIONS[step].options.map(opt => (
                  <button
                    key={opt.value}
                    className={`quiz-option ${answers[QUESTIONS[step].id] === opt.value ? 'selected' : ''}`}
                    onClick={() => selectOption(opt.value)}
                  >
                    <span className="quiz-option-icon">{opt.icon}</span>
                    <div>
                      <div className="quiz-option-label">{opt.label}</div>
                      <div className="quiz-option-desc">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="quiz-nav">
                {step > 0 ? (
                  <button className="auth-back-btn" onClick={goBack}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  Click an option to continue
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="quiz-results">
            <div className="quiz-results-icon">🎉</div>
            <h1 className="quiz-results-title">
              Your <span className="text-gradient">Perfect Matches</span>!
            </h1>
            <p className="quiz-results-sub">
              Based on your answers, here are the pets we think would be the best fit for you and your home.
            </p>

            <div className="quiz-match-grid">
              {matches.map((pet, i) => (
                <Link
                  key={i}
                  href="/adopt"
                  className="quiz-match-card"
                  style={{ animationDelay: `${i * 0.1}s`, animation: 'fadeInUp 0.5s ease both' }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{pet.emoji}</div>
                  <div className="quiz-match-percent" style={{
                    color: pet.matchPercent >= 80 ? 'var(--green-500)' : pet.matchPercent >= 60 ? 'var(--blue-500)' : 'var(--text-accent)',
                  }}>
                    {pet.matchPercent}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Match
                  </div>
                  <div className="quiz-match-name">{pet.name}</div>
                  <div className="quiz-match-breed">{pet.breed}</div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                    {pet.traits.map(t => (
                      <span key={t} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{t}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/adopt" className="btn btn-primary btn-lg" style={{ borderRadius: '100px' }}>
                🐾 Browse All Available Pets
              </Link>
              <button onClick={restart} className="btn btn-secondary btn-lg" style={{ borderRadius: '100px' }}>
                🔄 Retake Quiz
              </button>
            </div>

            {user && (
              <div style={{ marginTop: '32px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', maxWidth: '500px', margin: '32px auto 0' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>💡 Your preferences have been saved</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  We&apos;ll use these to highlight your best matches on the adoption page.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

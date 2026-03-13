'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import PetImage from '@/components/pets/PetImage';
import Icon from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

const QUESTIONS = [
  {
    step: 1,
    title: 'Your Lifestyle',
    subtitle: 'Help us understand your daily routine',
    icon: 'home',
    questions: [
      {
        id: 'activity',
        label: 'How active is your household?',
        options: [
          { value: 'low', label: 'Relaxed & Chill', icon: '🛋️', desc: 'We love a quiet evening in' },
          { value: 'medium', label: 'Moderately Active', icon: '🚶', desc: 'Daily walks and weekend outings' },
          { value: 'high', label: 'Very Active', icon: '🏃', desc: 'Hiking, running, always on the go' },
        ],
      },
      {
        id: 'space',
        label: 'What\'s your living situation?',
        options: [
          { value: 'apartment', label: 'Apartment', icon: '🏢', desc: 'Cozy space, no yard' },
          { value: 'house-small', label: 'Small Home', icon: '🏡', desc: 'Modest yard or patio' },
          { value: 'house-large', label: 'Large Home', icon: '🏠', desc: 'Big yard, lots of room' },
        ],
      },
    ],
  },
  {
    step: 2,
    title: 'Your Experience',
    subtitle: 'Tell us about your pet experience',
    icon: 'heart',
    questions: [
      {
        id: 'experience',
        label: 'Have you had pets before?',
        options: [
          { value: 'first', label: 'First Time', icon: '🌟', desc: 'This would be my first pet' },
          { value: 'some', label: 'Some Experience', icon: '📖', desc: 'I\'ve had a pet before' },
          { value: 'experienced', label: 'Very Experienced', icon: '🏆', desc: 'Lifelong pet owner' },
        ],
      },
      {
        id: 'household',
        label: 'Who lives in your home?',
        options: [
          { value: 'solo', label: 'Just Me', icon: '🧑', desc: 'Living alone' },
          { value: 'couple', label: 'Partner/Roommate', icon: '👫', desc: 'Adults only' },
          { value: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧', desc: 'Children in the home' },
        ],
      },
    ],
  },
  {
    step: 3,
    title: 'Your Preferences',
    subtitle: 'What are you looking for in a companion?',
    icon: 'paw',
    questions: [
      {
        id: 'petType',
        label: 'What type of pet are you interested in?',
        options: [
          { value: 'dog', label: 'Dog', icon: '🐕', desc: 'Loyal companion' },
          { value: 'cat', label: 'Cat', icon: '🐈', desc: 'Independent & loving' },
          { value: 'any', label: 'Open to Any', icon: '💕', desc: 'Love knows no species' },
        ],
      },
      {
        id: 'energy',
        label: 'What energy level do you prefer?',
        options: [
          { value: 'calm', label: 'Calm & Gentle', icon: '😌', desc: 'Relaxed and easy-going' },
          { value: 'moderate', label: 'Balanced', icon: '⚖️', desc: 'Mix of play and rest' },
          { value: 'high', label: 'High Energy', icon: '⚡', desc: 'Always ready to play' },
        ],
      },
    ],
  },
];

// Trait categories for scoring
const CALM_TRAITS = ['calm', 'gentle', 'laid-back', 'chill', 'napper', 'cozy', 'senior'];
const ENERGY_TRAITS = ['energetic', 'playful', 'fetch-lover', 'snow-lover'];
const FRIENDLY_TRAITS = ['friendly', 'people-lover', 'affectionate', 'sweet', 'loving', 'lovebug', 'attention-lover', 'social', 'belly-rub-lover'];
const SMART_TRAITS = ['smart', 'trainable', 'treat-motivated'];
const CUDDLY_TRAITS = ['cuddly', 'lap-cat', 'snuggly', 'cuddle-buddy'];

function scorePet(pet, answers) {
  let score = 0;
  const traits = pet.traits.map(t => t.toLowerCase());

  // Type preference
  if (answers.petType === 'any' || answers.petType === pet.type) {
    score += 25;
  } else {
    score -= 40; // heavy penalty for wrong type
  }

  // Activity + Energy match
  if (answers.activity === 'low' || answers.energy === 'calm') {
    score += traits.filter(t => CALM_TRAITS.includes(t)).length * 10;
    score -= traits.filter(t => ENERGY_TRAITS.includes(t)).length * 5;
  } else if (answers.activity === 'high' || answers.energy === 'high') {
    score += traits.filter(t => ENERGY_TRAITS.includes(t)).length * 10;
    score -= traits.filter(t => CALM_TRAITS.includes(t)).length * 3;
  } else {
    score += 5; // moderate = everything is fine
  }

  // Experience level
  if (answers.experience === 'first') {
    score += traits.filter(t => FRIENDLY_TRAITS.includes(t)).length * 8;
    score += traits.filter(t => SMART_TRAITS.includes(t)).length * 5;
    if (pet.restrictions.length > 0) score -= 10;
    if (pet.age === 'Puppy') score -= 5; // puppies are harder for first-timers
  } else if (answers.experience === 'experienced') {
    score += 5; // experienced owners are flexible
    if (pet.restrictions.includes('needs-patience')) score += 5;
  }

  // Household - kids
  if (answers.household === 'family') {
    if (pet.restrictions.includes('no-young-children')) score -= 30;
    score += traits.filter(t => FRIENDLY_TRAITS.includes(t)).length * 5;
    if (pet.age === 'Puppy') score += 5; // families like puppies
  }

  // Space
  if (answers.space === 'apartment') {
    if (pet.type === 'cat') score += 10;
    score -= traits.filter(t => ENERGY_TRAITS.includes(t)).length * 3;
  } else if (answers.space === 'house-large') {
    if (pet.type === 'dog') score += 5;
    score += traits.filter(t => ENERGY_TRAITS.includes(t)).length * 3;
  }

  // Bonded pairs bonus for families
  if (answers.household === 'family' && pet.restrictions.includes('must-adopt-together')) {
    score += 5;
  }

  // General friendliness boost
  score += traits.filter(t => FRIENDLY_TRAITS.includes(t)).length * 3;
  score += traits.filter(t => CUDDLY_TRAITS.includes(t)).length * 4;

  return Math.max(0, Math.min(100, score));
}

export default function PetMatchQuiz({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);
  const modalRef = useRef(null);

  const results = useMemo(() => {
    if (!showResults) return [];
    return pets
      .map(pet => ({ ...pet, score: scorePet(pet, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [showResults, answers]);

  // Animate results reveal
  useEffect(() => {
    if (!showResults) { setRevealIndex(-1); return; }
    const timers = [];
    results.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealIndex(i), 400 + i * 300));
    });
    return () => timers.forEach(clearTimeout);
  }, [showResults, results]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Close on background click
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  if (!isOpen) return null;

  const currentQuestion = QUESTIONS[currentStep];
  const isAllAnswered = currentQuestion?.questions.every(q => answers[q.id]);
  const progress = showResults ? 100 : ((currentStep) / QUESTIONS.length) * 100;

  const handleAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setRevealIndex(-1);
  };

  return (
    <div className="quiz-overlay" ref={modalRef} onClick={handleBackdropClick}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="quiz-close" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>

        {/* Progress bar */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step indicators */}
        {!showResults && (
          <div className="quiz-steps">
            {QUESTIONS.map((q, i) => (
              <div key={i} className={`quiz-step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}>
                <div className="quiz-step-num">
                  {i < currentStep ? (
                    <Icon name="check" size={12} color="#fff" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="quiz-step-label">{q.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {showResults ? (
          <div className="quiz-results">
            <div className="quiz-results-header">
              <div className="quiz-results-emoji">🎉</div>
              <h2>Your Perfect Matches!</h2>
              <p>Based on your lifestyle and preferences, these pets would be an amazing fit for you.</p>
            </div>
            <div className="quiz-results-grid">
              {results.map((pet, i) => {
                const isRevealed = i <= revealIndex;
                const days = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);
                return (
                  <div
                    key={pet.id}
                    className={`quiz-result-card ${isRevealed ? 'revealed' : ''}`}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    {i === 0 && <div className="quiz-best-match-badge">🏆 Best Match</div>}
                    <div className="quiz-result-img">
                      <PetImage pet={pet} />
                      <div className="quiz-score-ring">
                        <svg viewBox="0 0 36 36" className="quiz-score-svg">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="#fff" strokeWidth="3"
                            strokeDasharray={`${pet.score}, 100`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1s ease 0.5s' }}
                          />
                        </svg>
                        <span className="quiz-score-text">{pet.score}%</span>
                      </div>
                    </div>
                    <div className="quiz-result-body">
                      <h3>{pet.name}</h3>
                      <p className="quiz-result-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
                      <p className="quiz-result-desc">{pet.description.split('.')[0]}.</p>
                      <div className="quiz-result-traits">
                        {pet.traits.slice(0, 3).map(t => (
                          <span key={t} className="badge badge-blue">{t.replace(/-/g, ' ')}</span>
                        ))}
                      </div>
                      {days > 20 && (
                        <div className="quiz-result-waiting">
                          <Icon name="clock" size={12} color="var(--rose-500)" />
                          <span>Waiting {days} days for a home</span>
                        </div>
                      )}
                      <Link href={`/adopt/${pet.id}`} className="btn btn-primary btn-sm quiz-result-cta" onClick={onClose}>
                        <Icon name="paw" size={14} color="#fff" /> Meet {pet.name.split(' ')[0]}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="quiz-results-actions">
              <button className="btn btn-ghost" onClick={restart}>
                <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} /> Retake Quiz
              </button>
              <Link href="/adopt" className="btn btn-secondary" onClick={onClose}>
                View All Pets
              </Link>
            </div>
          </div>
        ) : (
          <div className="quiz-question-panel" key={currentStep}>
            <div className="quiz-question-header">
              <div className="quiz-question-icon">
                <Icon name={currentQuestion.icon} size={24} color="var(--blue-500)" />
              </div>
              <h2>{currentQuestion.title}</h2>
              <p>{currentQuestion.subtitle}</p>
            </div>

            {currentQuestion.questions.map(q => (
              <div key={q.id} className="quiz-question-group">
                <h4 className="quiz-question-label">{q.label}</h4>
                <div className="quiz-options">
                  {q.options.map(opt => (
                    <button
                      key={opt.value}
                      className={`quiz-option ${answers[q.id] === opt.value ? 'selected' : ''}`}
                      onClick={() => handleAnswer(q.id, opt.value)}
                    >
                      <span className="quiz-option-icon">{opt.icon}</span>
                      <div className="quiz-option-text">
                        <strong>{opt.label}</strong>
                        <span>{opt.desc}</span>
                      </div>
                      <div className="quiz-option-check">
                        {answers[q.id] === opt.value && <Icon name="check" size={16} color="var(--blue-500)" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="quiz-nav">
              {currentStep > 0 && (
                <button className="btn btn-ghost" onClick={prevStep}>
                  <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} /> Back
                </button>
              )}
              <button
                className="btn btn-primary"
                disabled={!isAllAnswered}
                onClick={nextStep}
                style={{ marginLeft: 'auto' }}
              >
                {currentStep === QUESTIONS.length - 1 ? 'See My Matches' : 'Next'}
                <Icon name="arrow" size={14} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

# SkillHire Premium – HTML/CSS Landing Page Code Examples

## 🎨 Modern Landing Page Code Snippets

Below are production-ready code examples for key landing page sections using modern web technologies.

---

## 1. HERO SECTION

```html
<!-- Hero Section with Interactive Elements -->
<section class="hero">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-headline">
        Stop Applying Blindly.
        <span class="gradient-text">Get Job-Ready Before You Apply.</span>
      </h1>
      
      <p class="hero-subheadline">
        Your complete job readiness platform. Analyze your resume, practice interviews, 
        identify skill gaps, and get hired with confidence.
      </p>
      
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">5,000+</span>
          <span class="stat-label">Students Analyzed</span>
        </div>
        <div class="stat">
          <span class="stat-number">87%</span>
          <span class="stat-label">Interview Success Rate</span>
        </div>
        <div class="stat">
          <span class="stat-number">3x</span>
          <span class="stat-label">Faster Job Offers</span>
        </div>
      </div>
      
      <div class="hero-ctas">
        <button class="btn btn-primary">
          Start Free Analysis
          <svg class="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" />
          </svg>
        </button>
        <button class="btn btn-secondary">
          <svg class="icon-play" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          Watch 2-min Demo
        </button>
      </div>
    </div>
    
    <div class="hero-visual">
      <div class="dashboard-mockup">
        <div class="mockup-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="mockup-content">
          <!-- Animated dashboard preview -->
          <div class="resume-score" style="animation: slideIn 0.6s ease-out;">
            <div class="score-circle">82</div>
            <span>Resume Score</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="hero-gradient-bg"></div>
</section>

<!-- Hero Styles -->
<style>
.hero {
  position: relative;
  overflow: hidden;
  padding: 100px 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-headline {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  color: #0F3A7D;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subheadline {
  font-size: 18px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 500px;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #0F3A7D;
}

.stat-label {
  font-size: 14px;
  color: #6B7280;
  margin-top: 4px;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #14B8A6;
  color: white;
  box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 184, 166, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #0F3A7D;
  border: 2px solid #0F3A7D;
}

.btn-secondary:hover {
  background: #0F3A7D;
  color: white;
}

.icon-arrow, .icon-play {
  width: 20px;
  height: 20px;
}

.hero-visual {
  position: relative;
  height: 400px;
}

.dashboard-mockup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.mockup-header {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #F3F4F6;
  border-bottom: 1px solid #E5E7EB;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #EF4444; }
.dot.yellow { background: #FBBF24; }
.dot.green { background: #10B981; }

.mockup-content {
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.resume-score {
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  margin: 0 auto 16px;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.hero-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(15, 58, 125, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
  z-index: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-headline {
    font-size: 36px;
  }
  
  .hero-ctas {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
```

---

## 2. PROBLEM STATEMENT SECTION

```html
<!-- Problem Cards Section -->
<section class="problems-section">
  <div class="problems-container">
    <h2 class="section-headline">Why Do Smart Students Get Rejected?</h2>
    
    <div class="problems-grid">
      <div class="problem-card">
        <div class="problem-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path d="M9 7h.01" />
          </svg>
        </div>
        
        <h3 class="problem-title">Resume Blind Spot</h3>
        
        <p class="problem-description">
          Your resume reaches 2% of applications through ATS filters. You don't know which keywords are missing or if formatting matters.
        </p>
        
        <div class="problem-metric">
          <span class="metric-value">2%</span>
          <span class="metric-label">Pass ATS</span>
        </div>
      </div>
      
      <div class="problem-card">
        <div class="problem-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1C6.477 1 2 5.477 2 11s4.477 10 10 10 10-4.477 10-10S17.523 1 12 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.828 0 1.5-.672 1.5-1.5S16.328 7 15.5 7 14 7.672 14 8.5s.672 1.5 1.5 1.5zm-7 0c.828 0 1.5-.672 1.5-1.5S9.328 7 8.5 7 7 7.672 7 8.5 7.672 10 8.5 10zm3.5 6.75c2.34 0 4.35-1.56 5.08-3.65H6.42c.73 2.09 2.74 3.65 5.08 3.65z" />
          </svg>
        </div>
        
        <h3 class="problem-title">Interview Anxiety</h3>
        
        <p class="problem-description">
          You practice answers in your head but choke in real interviews. No real-time feedback. No structured coaching. Just hope.
        </p>
        
        <div class="problem-metric">
          <span class="metric-value">0</span>
          <span class="metric-label">Real Feedback</span>
        </div>
      </div>
      
      <div class="problem-card">
        <div class="problem-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20m0-20c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-3 10h6" />
          </svg>
        </div>
        
        <h3 class="problem-title">Skill Gap Mystery</h3>
        
        <p class="problem-description">
          Companies ask for 'leadership' and 'communication' but your resume and interview prep don't address it. You don't know what you're actually missing.
        </p>
        
        <div class="problem-metric">
          <span class="metric-value">?</span>
          <span class="metric-label">Unknown Gaps</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Problem Section Styles -->
<style>
.problems-section {
  padding: 80px 20px;
  background: #F9FAFB;
}

.problems-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-headline {
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: #0F3A7D;
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.problem-card {
  background: white;
  padding: 40px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.problem-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: #14B8A6;
}

.problem-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
  stroke-width: 2;
}

.problem-icon svg {
  width: 32px;
  height: 32px;
}

.problem-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #0F3A7D;
}

.problem-description {
  font-size: 15px;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.problem-metric {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #EF4444;
}

.metric-label {
  font-size: 14px;
  color: #6B7280;
}

@media (max-width: 768px) {
  .section-headline {
    font-size: 28px;
    margin-bottom: 40px;
  }
  
  .problems-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
```

---

## 3. FEATURES SECTION

```html
<!-- Three-Pillar Features Section -->
<section class="features-section">
  <div class="features-container">
    <h2 class="section-headline">
      Three Platforms in One. All Your Job Readiness Tools.
    </h2>
    
    <div class="features-grid">
      <div class="feature-pillar">
        <div class="pillar-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z" />
          </svg>
        </div>
        
        <h3 class="pillar-title">Resume Intelligence</h3>
        <p class="pillar-subtitle">AI analyzes your resume like an ATS would</p>
        
        <ul class="pillar-features">
          <li>
            <span class="feature-icon">✓</span>
            Keyword gap analysis
          </li>
          <li>
            <span class="feature-icon">✓</span>
            ATS compatibility score
          </li>
          <li>
            <span class="feature-icon">✓</span>
            Real-time content feedback
          </li>
        </ul>
        
        <div class="feature-visual">
          <div class="mini-dashboard">
            <div class="score-bar">
              <div class="score-fill" style="width: 82%;"></div>
            </div>
            <span class="score-text">82/100 Score</span>
          </div>
        </div>
      </div>
      
      <div class="feature-pillar featured">
        <div class="featured-badge">Most Popular</div>
        
        <div class="pillar-icon highlight">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        
        <h3 class="pillar-title">Interview Mastery</h3>
        <p class="pillar-subtitle">Practice with realistic AI interviews</p>
        
        <ul class="pillar-features">
          <li>
            <span class="feature-icon">✓</span>
            Role-specific questions
          </li>
          <li>
            <span class="feature-icon">✓</span>
            Real-time feedback
          </li>
          <li>
            <span class="feature-icon">✓</span>
            Performance analytics
          </li>
        </ul>
        
        <div class="feature-visual">
          <div class="mini-interview">
            <div class="avatar"></div>
            <div class="feedback-box">Clarity: 8/10</div>
          </div>
        </div>
      </div>
      
      <div class="feature-pillar">
        <div class="pillar-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7l-5-5z" />
          </svg>
        </div>
        
        <h3 class="pillar-title">Skill Gap Roadmap</h3>
        <p class="pillar-subtitle">Identify and close your gaps with curated learning</p>
        
        <ul class="pillar-features">
          <li>
            <span class="feature-icon">✓</span>
            Compare to job requirements
          </li>
          <li>
            <span class="feature-icon">✓</span>
            Personalized learning path
          </li>
          <li>
            <span class="feature-icon">✓</span>
            Track progress over time
          </li>
        </ul>
        
        <div class="feature-visual">
          <div class="mini-roadmap">
            <div class="roadmap-step">Step 1</div>
            <div class="roadmap-step">Step 2</div>
            <div class="roadmap-step">Step 3</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Section Styles -->
<style>
.features-section {
  padding: 100px 20px;
  background: white;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 60px;
}

.feature-pillar {
  background: #F9FAFB;
  padding: 40px 32px;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  transition: all 0.3s ease;
  position: relative;
}

.feature-pillar.featured {
  background: white;
  border-color: #14B8A6;
  box-shadow: 0 8px 32px rgba(20, 184, 166, 0.2);
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #14B8A6;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.pillar-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
  font-size: 32px;
}

.pillar-icon.highlight {
  width: 80px;
  height: 80px;
}

.pillar-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F3A7D;
  margin-bottom: 8px;
}

.pillar-subtitle {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
}

.pillar-features {
  list-style: none;
  padding: 0;
  margin-bottom: 32px;
}

.pillar-features li {
  font-size: 15px;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  color: #10B981;
  font-weight: 700;
  font-size: 18px;
}

.feature-visual {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  text-align: center;
}

.mini-dashboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-bar {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #7C3AED 0%, #14B8A6 100%);
}

.score-text {
  font-size: 13px;
  font-weight: 600;
  color: #0F3A7D;
}

.mini-interview {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
}

.feedback-box {
  background: #DBEAFE;
  color: #0369A1;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.mini-roadmap {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.roadmap-step {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-pillar.featured {
    transform: scale(1);
  }
}
</style>
```

---

## 4. COMPARISON TABLE

```html
<!-- Competitive Comparison Table -->
<section class="comparison-section">
  <div class="comparison-container">
    <h2 class="section-headline">How SkillHire Compares</h2>
    
    <div class="table-responsive">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="skillhire-col">
              <span class="skillhire-badge">SkillHire</span>
            </th>
            <th>Rezi</th>
            <th>Jobscan</th>
            <th>Interview Sidekick</th>
          </tr>
        </thead>
        <tbody>
          <tr class="feature-row">
            <td class="feature-name">Resume Analysis</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-check">✓</span></td>
            <td><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
          </tr>
          <tr class="feature-row">
            <td class="feature-name">Interview Practice</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-check">✓</span></td>
          </tr>
          <tr class="feature-row">
            <td class="feature-name">Skill Gap Analysis</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-half">⭐</span></td>
            <td><span class="badge-x">✗</span></td>
          </tr>
          <tr class="feature-row">
            <td class="feature-name">Interview Failure Analysis</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
          </tr>
          <tr class="feature-row">
            <td class="feature-name">Learning Recommendations</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
          </tr>
          <tr class="feature-row">
            <td class="feature-name">Student Pricing</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
          </tr>
          <tr class="feature-row highlight-row">
            <td class="feature-name">All-in-One Platform</td>
            <td class="skillhire-col"><span class="badge-check">✓</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
            <td><span class="badge-x">✗</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <p class="comparison-note">
      <strong>Best for students combining resume, interview, and skill preparation.</strong>
      SkillHire is the only platform bringing all three dimensions together with failure analysis.
    </p>
  </div>
</section>

<!-- Comparison Table Styles -->
<style>
.comparison-section {
  padding: 100px 20px;
  background: #F9FAFB;
}

.comparison-container {
  max-width: 1000px;
  margin: 0 auto;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.comparison-table thead {
  background: #0F3A7D;
  color: white;
}

.comparison-table th {
  padding: 20px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #E5E7EB;
}

.skillhire-col {
  background: #F0F9FF;
  border: 2px solid #14B8A6;
}

.comparison-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.feature-row {
  transition: background 0.2s;
}

.feature-row:hover {
  background: #F9FAFB;
}

.feature-row.highlight-row td {
  background: #ECFDF5;
  font-weight: 600;
}

.feature-name {
  color: #0F3A7D;
  font-weight: 600;
}

.badge-check {
  color: #10B981;
  font-size: 20px;
  font-weight: 700;
}

.badge-x {
  color: #D1D5DB;
  font-size: 20px;
  font-weight: 700;
}

.badge-half {
  color: #FBBF24;
  font-size: 18px;
}

.skillhire-badge {
  background: #14B8A6;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
}

.comparison-note {
  text-align: center;
  margin-top: 32px;
  font-size: 15px;
  color: #6B7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .comparison-table {
    font-size: 13px;
  }
  
  .comparison-table th,
  .comparison-table td {
    padding: 12px;
  }
}
</style>
```

---

## 5. STICKY HEADER CTA

```html
<!-- Sticky Header with CTA -->
<header class="sticky-header">
  <div class="sticky-container">
    <div class="sticky-left">
      <h3 class="sticky-headline">Ready to Get Job-Ready?</h3>
    </div>
    
    <div class="sticky-right">
      <button class="btn btn-primary sticky-cta">
        Get Started Free
        <svg class="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>
  </div>
</header>

<!-- Sticky Header Styles -->
<style>
.sticky-header {
  position: sticky;
  bottom: 0;
  background: #0F3A7D;
  color: white;
  padding: 16px 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: none;
}

.sticky-header.active {
  display: block;
}

.sticky-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.sticky-headline {
  font-size: 18px;
  font-weight: 600;
}

.sticky-cta {
  background: #14B8A6;
  padding: 12px 24px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .sticky-container {
    flex-direction: column;
  }
  
  .sticky-headline {
    font-size: 16px;
  }
  
  .sticky-cta {
    width: 100%;
  }
}
</style>

<!-- JavaScript to Activate Sticky Header -->
<script>
const stickyHeader = document.querySelector('.sticky-header');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  const heroBottom = heroSection.offsetHeight;
  const scrollTop = window.scrollY;
  
  if (scrollTop > heroBottom) {
    stickyHeader.classList.add('active');
  } else {
    stickyHeader.classList.remove('active');
  }
});
</script>
```

---

## 6. TESTIMONIALS CAROUSEL

```html
<!-- Testimonials Section with Carousel -->
<section class="testimonials-section">
  <div class="testimonials-container">
    <h2 class="section-headline">Trusted by 5,000+ Students Across India</h2>
    
    <div class="testimonials-carousel">
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        
        <p class="testimonial-quote">
          "I was applying for 50+ jobs monthly with 0 interviews. SkillHire's resume analysis showed I was missing 15 key keywords. After fixing them, I got 3 interviews in the same week!"
        </p>
        
        <div class="testimonial-author">
          <div class="author-avatar">PS</div>
          <div class="author-info">
            <h4>Priya Sharma</h4>
            <p>2nd Year CSE, BITS Pilani</p>
          </div>
        </div>
      </div>
      
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        
        <p class="testimonial-quote">
          "The interview prep was insane. I practiced 20 times, got feedback each time, and nailed my Amazon internship round."
        </p>
        
        <div class="testimonial-author">
          <div class="author-avatar">AV</div>
          <div class="author-info">
            <h4>Arjun Verma</h4>
            <p>2nd Year ECE, IIT Delhi</p>
          </div>
        </div>
      </div>
      
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        
        <p class="testimonial-quote">
          "The skill gap analysis told me exactly what I was missing. I completed 2 courses in 4 weeks and my job readiness went from 45% to 78%!"
        </p>
        
        <div class="testimonial-author">
          <div class="author-avatar">NP</div>
          <div class="author-info">
            <h4>Neha Patel</h4>
            <p>Final Year IT, DTU</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="carousel-controls">
      <button class="carousel-dot active"></button>
      <button class="carousel-dot"></button>
      <button class="carousel-dot"></button>
    </div>
  </div>
</section>

<!-- Testimonials Styles -->
<style>
.testimonials-section {
  padding: 100px 20px;
  background: white;
}

.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
}

.testimonials-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 60px;
}

.testimonial-card {
  background: #F9FAFB;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: #14B8A6;
}

.testimonial-stars {
  color: #FBBF24;
  font-size: 18px;
  margin-bottom: 16px;
}

.testimonial-quote {
  font-size: 15px;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 24px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  gap: 12px;
  align-items: center;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #14B8A6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.author-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #0F3A7D;
  margin-bottom: 2px;
}

.author-info p {
  font-size: 13px;
  color: #6B7280;
}

.carousel-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #D1D5DB;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-dot.active {
  background: #14B8A6;
  width: 32px;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .testimonials-carousel {
    grid-template-columns: 1fr;
  }
}
</style>
```

---

## 7. PRICING SECTION

```html
<!-- Pricing Tiers -->
<section class="pricing-section">
  <div class="pricing-container">
    <h2 class="section-headline">Simple, Transparent Pricing</h2>
    <p class="pricing-subheadline">Start free. Upgrade when you're ready.</p>
    
    <div class="pricing-grid">
      <!-- Free Tier -->
      <div class="pricing-card">
        <div class="tier-name">Free Starter</div>
        
        <div class="tier-price">
          <span class="currency">₹</span>
          <span class="amount">0</span>
          <span class="period">/month</span>
        </div>
        
        <p class="tier-description">Get started with essential features</p>
        
        <button class="btn btn-secondary tier-cta">Get Started</button>
        
        <ul class="tier-features">
          <li><span class="check-icon">✓</span> Resume upload & basic ATS score</li>
          <li><span class="check-icon">✓</span> 1 free mock interview/month</li>
          <li><span class="check-icon">✓</span> Skill gap overview (top 5)</li>
          <li><span class="check-icon">✗</span> Full skill analysis</li>
          <li><span class="check-icon">✗</span> Learning recommendations</li>
        </ul>
      </div>
      
      <!-- Premium Tier -->
      <div class="pricing-card featured">
        <div class="tier-badge">Most Popular</div>
        
        <div class="tier-name">Premium Student</div>
        
        <div class="tier-price">
          <span class="currency">₹</span>
          <span class="amount">199</span>
          <span class="period">/month</span>
        </div>
        
        <p class="tier-description">Complete job readiness toolkit</p>
        
        <button class="btn btn-primary tier-cta">Start 7-Day Free Trial</button>
        
        <p class="trial-note">No credit card required</p>
        
        <ul class="tier-features">
          <li><span class="check-icon">✓</span> Unlimited resume analysis</li>
          <li><span class="check-icon">✓</span> 5+ mock interviews/month</li>
          <li><span class="check-icon">✓</span> Full skill gap analysis</li>
          <li><span class="check-icon">✓</span> Personalized learning paths</li>
          <li><span class="check-icon">✓</span> Interview failure analysis</li>
          <li><span class="check-icon">✓</span> Priority email support</li>
        </ul>
      </div>
      
      <!-- Pro Tier -->
      <div class="pricing-card">
        <div class="tier-name">Pro Intensive</div>
        
        <div class="tier-price">
          <span class="currency">₹</span>
          <span class="amount">499</span>
          <span class="period">/month</span>
        </div>
        
        <p class="tier-description">Advanced features & personal coaching</p>
        
        <button class="btn btn-secondary tier-cta">Start 7-Day Free Trial</button>
        
        <ul class="tier-features">
          <li><span class="check-icon">✓</span> Everything in Premium +</li>
          <li><span class="check-icon">✓</span> AI Career Coach (chat)</li>
          <li><span class="check-icon">✓</span> LinkedIn optimization</li>
          <li><span class="check-icon">✓</span> Cover letter generator</li>
          <li><span class="check-icon">✓</span> Company-specific interview prep</li>
          <li><span class="check-icon">✓</span> Monthly resume review</li>
        </ul>
      </div>
    </div>
    
    <div class="pricing-footer">
      <p><strong>Annual Billing:</strong> Save 30% with ₹2,000/year (Premium) or ₹4,490/year (Pro)</p>
      <p><strong>Money-Back Guarantee:</strong> Not happy? Full refund within 30 days, no questions asked.</p>
    </div>
  </div>
</section>

<!-- Pricing Styles -->
<style>
.pricing-section {
  padding: 100px 20px;
  background: #F9FAFB;
}

.pricing-container {
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-subheadline {
  text-align: center;
  font-size: 18px;
  color: #6B7280;
  margin-bottom: 60px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.pricing-card {
  background: white;
  padding: 40px 32px;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  transition: all 0.3s ease;
  position: relative;
}

.pricing-card.featured {
  border-color: #14B8A6;
  box-shadow: 0 12px 40px rgba(20, 184, 166, 0.2);
  transform: scale(1.05);
}

.tier-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #14B8A6;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.tier-name {
  font-size: 20px;
  font-weight: 700;
  color: #0F3A7D;
  margin-bottom: 16px;
}

.tier-price {
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 18px;
  color: #6B7280;
}

.amount {
  font-size: 48px;
  font-weight: 700;
  color: #0F3A7D;
}

.period {
  font-size: 14px;
  color: #6B7280;
}

.tier-description {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
}

.tier-cta {
  width: 100%;
  margin-bottom: 8px;
}

.trial-note {
  font-size: 12px;
  color: #10B981;
  text-align: center;
  margin-bottom: 24px;
  font-weight: 500;
}

.tier-features {
  list-style: none;
  padding: 0;
}

.tier-features li {
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-icon {
  color: #10B981;
  font-weight: 700;
  font-size: 16px;
}

.pricing-footer {
  text-align: center;
  background: white;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
}

.pricing-footer p {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 12px;
}

.pricing-footer strong {
  color: #0F3A7D;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.featured {
    transform: scale(1);
  }
}
</style>
```

---

## Implementation Notes

1. **Framework:** Build with React/Next.js for component reusability
2. **Styling:** Use Tailwind CSS or CSS modules for maintainability
3. **Animations:** Use Framer Motion for smooth, performant animations
4. **Form Handling:** Use React Hook Form + Zod for validation
5. **Hosting:** Deploy on Vercel for optimal Next.js performance
6. **Analytics:** Integrate Google Analytics 4 + Hotjar for user tracking
7. **Email:** Use SendGrid/Mailgun for email delivery

These code examples provide production-ready foundations for your landing page. Customize colors, copy, and imagery to match your brand guidelines.


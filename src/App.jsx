import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ChevronRight, Cpu, Database, Cloud, Zap, Mail, Github, Linkedin, MapPin, ExternalLink, Box, Layers, Terminal } from 'lucide-react';
import Lenis from 'lenis';
import './App.css';

// Smooth Scroll Setup with Lenis
const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
};

// Split Text Component for character-by-character animation
const SplitText = ({ text, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <span style={{ display: 'inline-block' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.25em' }}>
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: delay + (i * 0.1) + (j * 0.03),
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

// Tilt Component for premium card feel
const Tilt = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const bootLogs = [
    "Establishing neural links...",
    "Calibrating n8n runtime...",
    "Securing API gateways...",
    "Initializing agentic loops...",
    "Optimizing LLM chains...",
    "Systems operational."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 800);
          return 100;
        }
        return old + 2;
      });
    }, 40);

    const logInterval = setInterval(() => {
      setLogs(prev => {
        if (prev.length < bootLogs.length) {
          return [...prev, bootLogs[prev.length]];
        }
        return prev;
      });
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(logInterval);
    };
  }, [onFinish]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="preloader"
    >
      <div className="preloader-content">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="logo neon-text"
          style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
        >
          VEILU KM<span className="dot">.</span>
        </motion.div>

        <div className="boot-logs">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.7, x: 0 }}
              className="log-item"
            >
              <span className="log-arrow">{">"}</span> {log}
            </motion.div>
          ))}
        </div>

        <div className="loader-container">
          <div className="loader-stats">
            <span>CORE_LOAD: {progress}%</span>
            <span>STATUS: ACTIVE</span>
          </div>
          <div className="loader-bar">
            <motion.div
              className="loader-progress"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      <div className="preloader-bg-text">AGENTIC SYSTEMS / AUTO-ARCHITECT / VOID_INIT</div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const trailerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      const { clientX, clientY } = e;
      if (trailerRef.current) {
        trailerRef.current.style.left = `${clientX - 20}px`;
        trailerRef.current.style.top = `${clientY - 20}px`;
      }
    };

    const handleHover = (e) => {
      const target = e.target;
      const isPickable = target.closest('a') || target.closest('button') || target.closest('.expertise-card') || target.closest('.service-card') || target.closest('.magnetic-wrapper');
      setIsHovering(!!isPickable);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleHover);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <div
      ref={trailerRef}
      className="cursor-trailer"
      style={{
        transform: isHovering ? 'scale(2)' : 'scale(1)',
        backgroundColor: isHovering ? 'rgba(0, 255, 153, 0.1)' : 'transparent',
        borderColor: isHovering ? 'var(--accent)' : 'rgba(0, 255, 153, 0.5)'
      }}
    />
  );
};

// Magnetic Wrapper for Buttons
const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => (
  <nav className="navbar">
    <div className="nav-container">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="logo neon-text"
      >
        VEILU KM<span className="dot">.</span>
      </motion.div>
      <div className="nav-links">
        <MagneticButton><a href="#about">Systems</a></MagneticButton>
        <MagneticButton><a href="#services">Services</a></MagneticButton>
        <MagneticButton>
          <motion.a
            whileHover={{ scale: 1.05, color: '#00ff99' }}
            href="/resume.pdf"
            target="_blank"
            className="resume-link"
            style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            RESUME.PDF
          </motion.a>
        </MagneticButton>
        <MagneticButton>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="contact-nav btn-primary"
            style={{ borderRadius: '100px', border: 'none' }}
          >
            Work With Me
          </motion.a>
        </MagneticButton>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  const rotatingPhrases = ['n8n Workflows', 'Agentic Loops', 'LLM Chains', 'Tool Calls', 'Autonomous Agents'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="hero-section" id="home">
      <div className="light-streak" style={{ top: '20%' }}></div>
      <div className="light-streak" style={{ top: '60%', animationDelay: '4s' }}></div>

      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="hero-content"
      >
        <div className="badge-container">
          <span className="hero-badge">Available for Projects</span>
        </div>
        <h1 className="hero-headline">
          <SplitText text="Building" delay={0.5} /> <br />
          <span className="neon-text"><SplitText text="Agentic" delay={0.8} /></span> <br />
          <SplitText text="n8n Workflows" delay={1.1} /><span className="neon-text">.</span>
        </h1>
        <h2 className="hero-subheading">
          Expert in Autonomous AI Agents | n8n Workflow Architect | System Automator
        </h2>

        <div className="rotating-text-wrapper">
          <AnimatePresence mode="wait">
            <motion.span
              key={textIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="rotating-phrase"
            >
              {rotatingPhrases[textIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="arrow-text"> → </span>
          <span className="static-tag">Scale</span>
        </div>

        <div className="hero-ctas">
          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#experience"
              className="btn btn-primary"
            >
              Explore My Systems <ChevronRight size={18} />
            </motion.a>
          </MagneticButton>
          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/resume.pdf"
              download="AI_Automation_Engineer_Resume.pdf"
              className="btn btn-secondary"
            >
              Download Resume
            </motion.a>
          </MagneticButton>
        </div>

        <div className="floating-tech-bubbles">
          {[
            { name: 'n8n', slug: 'n8n', top: '-15%', left: '5%' },
            { name: 'Power BI', slug: 'microsoftpowerbi', top: '15%', left: '-12%' },
            { name: 'Python', slug: 'python', top: '75%', left: '2%' },
            { name: 'AWS', slug: 'amazonwebservices', top: '-10%', right: '5%' },
            { name: 'Docker', slug: 'docker', top: '25%', right: '-10%' },
            { name: 'Zapier', slug: 'zapier', top: '70%', right: '0%' },
            { name: 'Postgres', slug: 'postgresql', top: '40%', left: '-8%' },
            { name: 'Jenkins', slug: 'jenkins', top: '45%', right: '-15%' },
            { name: 'Java', slug: 'java', top: '10%', right: '15%' },
            { name: 'MongoDB', slug: 'mongodb', top: '85%', right: '10%' },
            { name: 'OpenAI', slug: 'openai', top: '0%', left: '30%' },
            { name: 'Anthropic', slug: 'claude', top: '90%', left: '40%' },
            { name: 'Gemini', slug: 'googlegemini', top: '20%', right: '35%' },
            { name: 'LangChain', slug: 'langchain', top: '55%', left: '45%' },
            { name: 'Airtable', slug: 'airtable', top: '40%', right: '5%' },
            { name: 'Pinecone', slug: 'pinecone', top: '65%', right: '12%' },
            { name: 'Excel', slug: 'microsoftexcel', top: '60%', right: '25%' },
          ].map((tech, i) => (
            <motion.div
              key={i}
              className="tech-bubble"
              style={{ top: tech.top, left: tech.left, right: tech.right }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}`}
                alt={tech.name}
                className="bubble-brand-icon"
              />
              {tech.name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section >
  );
};

const TechMarquee = () => {
  const tools = [
    { name: "n8n", slug: "n8n" },
    { name: "Zapier", slug: "zapier" },
    { name: "OpenAI", slug: "openai" },
    { name: "Anthropic", slug: "claude" },
    { name: "Gemini", slug: "googlegemini" },
    { name: "LangChain", slug: "langchain" },
    { name: "Power BI", slug: "microsoftpowerbi" },
    { name: "Excel", slug: "microsoftexcel" },
    { name: "Python", slug: "python" },
    { name: "Postgres", slug: "postgresql" },
    { name: "Java", slug: "java" },
    { name: "AWS", slug: "amazonwebservices" },
    { name: "Docker", slug: "docker" },
    { name: "Airtable", slug: "airtable" },
    { name: "Pinecone", slug: "pinecone" },
    { name: "Jenkins", slug: "jenkins" },
    { name: "MongoDB", slug: "mongodb" }
  ];

  const displayTools = [...tools, ...tools];

  return (
    <div className="tech-marquee-wrapper">
      <div className="marquee-content">
        {displayTools.map((tool, i) => (
          <div key={i} className="marquee-item">
            <img
              src={`https://cdn.simpleicons.org/${tool.slug}`}
              alt={tool.name}
              className="marquee-brand-icon"
            />
            {tool.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const About = () => {
  const stats = [
    { label: "Automation Workflows", value: "15+" },
    { label: "Integrations", value: "API & Webhook" },
    { label: "Production Experience", value: "GenLab AI" },
    { label: "Academic CGPA", value: "79.6%" }
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-header">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="section-tag"
        >
          01 // PHILOSOPHY
        </motion.span>
        <h2 className="section-title gradient-text">Building AI Systems That Operate in Production.</h2>
      </div>

      <div className="about-grid">
        <div className="profile-visual">
          <div className="profile-bg-decorators">
            <div className="decorator-orb orb-1"></div>
            <div className="decorator-orb orb-2"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="profile-image-frame"
          >
            <div className="profile-img-container">
              <img src="/profile.jpg" alt="AI Automation Engineer Portrait" />
              <div className="image-overlay-glow"></div>
            </div>
          </motion.div>
        </div>

        <div className="about-content">
          <div className="bio-block">
            <p className="about-text">
              I specialize in architecting <strong>Agentic AI systems</strong> using <strong>n8n</strong>. My passion lies in transforming chaotic manual processes into streamlined, autonomous execution loops.
            </p>
            <p className="about-text">
              Currently working at <strong>GenLab</strong> as a <strong>Data Engineer & Tech Trainer</strong>, I design multi-step LLM reasoning chains that maintain 99.9% reliability while processing complex business data.
            </p>
          </div>

          <div className="about-badges">
            <span className="about-badge">Autonomous Agents</span>
            <span className="about-badge">n8n Architect</span>
            <span className="about-badge">Prompt Engineering</span>
            <span className="about-badge">ETL Pipelines</span>
          </div>

          <div className="personal-details-grid">
            <div className="detail-item">
              <span className="detail-label">IDENTITY:</span>
              <span className="detail-value">MOORTHY VK</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">BASE:</span>
              <span className="detail-value">CHENNAI, INDIA</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">LANGUAGE:</span>
              <span className="detail-value">ENGLISH, TAMIL</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">STATUS:</span>
              <span className="detail-value neon-text">OPEN FOR WORK</span>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Tilt>
                  <div className="glass-card stat-card">
                    <div className="shimmer-wrapper"><div className="shimmer"></div></div>
                    <div className="stat-glow"></div>
                    <h3 className="stat-value neon-text">{stat.value}</h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Methodology = () => {
  const steps = [
    {
      title: "Discovery",
      desc: "Analyzing existing workflows to identify high-impact automation opportunities.",
      icon: <Box size={24} />
    },
    {
      title: "Architecture",
      desc: "Designing robust agentic loops with n8n, ensuring clear logic & error handling.",
      icon: <Layers size={24} />
    },
    {
      title: "Integration",
      desc: "Connecting LLMs, Vector DBs, and APIs into a unified autonomous system.",
      icon: <Cpu size={24} />
    },
    {
      title: "Optimization",
      desc: "Continuous monitoring and prompt tuning for peak system performance.",
      icon: <Zap size={24} />
    }
  ];

  return (
    <section className="methodology-section">
      <div className="section-header centered">
        <span className="section-tag">02 // STRATEGY</span>
        <h2 className="section-title gradient-text">Execution Blueprint</h2>
      </div>

      <div className="methodology-grid">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Tilt>
              <div className="glass-card step-card">

                <div className="shimmer-wrapper"><div className="shimmer"></div></div>
                <span className="step-number">0{i + 1}</span>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ToolsGrid = () => {
  const categories = [
    { name: "n8n", slug: "n8n" },
    { name: "Zapier", slug: "zapier" },
    { name: "OpenAI", slug: "openai" },
    { name: "Anthropic", slug: "claude" },
    { name: "Gemini", slug: "googlegemini" },
    { name: "LangChain", slug: "langchain" },
    { name: "Python", slug: "python" },
    { name: "AWS", slug: "amazonwebservices" },
    { name: "Docker", slug: "docker" },
    { name: "Airtable", slug: "airtable" },
    { name: "Pinecone", slug: "pinecone" },
    { name: "MySQL", slug: "mysql" },
    { name: "MongoDB", slug: "mongodb" },
    { name: "Power BI", slug: "microsoftpowerbi" },
    { name: "Excel", slug: "microsoftexcel" },
    { name: "Java", slug: "java" },
    { name: "Postgres", slug: "postgresql" },
    { name: "Jenkins", slug: "jenkins" }
  ];

  return (
    <section className="tools-grid-section">
      <div className="section-header centered">
        <span className="section-tag">03 // STACK</span>
        <h2 className="section-title gradient-text">Technological Arsenal</h2>
      </div>

      <div className="honeycomb-wrapper">
        <div className="honeycomb-grid">
          {categories.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -10, 0],
              }}
              style={{
                zIndex: 1
              }}
              whileHover={{
                zIndex: 10,
                transition: { duration: 0.1 }
              }}
              transition={{
                delay: i * 0.05,
                y: {
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                default: { duration: 0.5 }
              }}
            >
              <div className="hexagon-item">
                <img
                  src={`https://cdn.simpleicons.org/${tool.slug}`}
                  alt={tool.name}
                  className="tool-brand-icon"
                />
                <span>{tool.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Agentic Automation",
      desc: "Architecting autonomous n8n workflows that think, act, and reason through multi-step business logic.",
      icon: <Cpu size={24} />,
      label: "Autonomous systems"
    },
    {
      title: "AI Integration",
      desc: "Embedding LLMs and Vector databases into your existing stack for intelligent RAG and reasoning.",
      icon: <Layers size={24} />,
      label: "Embedded AI models"
    },
    {
      title: "ETL & Data Architecture",
      desc: "Designing reliable pipelines to extract, transform, and load data from APIs, Webhooks, and SQL databases.",
      icon: <Database size={24} />,
      label: "Data infrastructure"
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="section-header">
        <span className="section-tag">04 // SERVICES</span>
        <h2 className="section-title gradient-text">What I Architect</h2>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Tilt>
              <div className="glass-card service-card">

                <div className="shimmer-wrapper"><div className="shimmer"></div></div>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-price neon-text">// {s.label}</span>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Expertise = () => {
  const categories = [
    {
      title: "Agentic n8n Workflows",
      icon: <Cpu size={32} />,
      items: ["Autonomous Agent Loops", "Multi-Step LLM Chains", "Error Handling & Retries", "API Orchestration", "Custom JS Node Logic"]
    },
    {
      title: "AI & Vector Intelligence",
      icon: <Layers size={32} />,
      items: ["Vector DB (Pinecone)", "RAG Architecture", "Prompt Tuning", "Function Calling"]
    },
    {
      title: "System Automation",
      icon: <Cloud size={32} />,
      items: ["Webhooks", "Data Sync", "Cloud Hosting", "Scalable ETL"]
    }
  ];

  return (
    <section id="expertise" className="expertise-section">
      <div className="section-header">
        <span className="section-tag">05 // CAPABILITIES</span>
        <h2 className="section-title gradient-text">Core Expertise</h2>
      </div>

      <div className="expertise-bento">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Tilt>
              <div className="bento-item">
                <div className="bento-glow"></div>
                <div className="bento-icon-wrapper neon-text">{cat.icon}</div>
                <h3>{cat.title}</h3>
                <div className="bento-list">
                  {cat.items.map((item, j) => (
                    <span key={j} className="bento-tag">{item}</span>
                  ))}
                </div>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


const ArchitectureShowcase = () => {
  const nodes = [
    { name: "Trigger", type: "webhook", icon: <Zap size={24} />, x: "10%" },
    { name: "n8n Agent", type: "core", icon: <Cpu size={24} />, x: "26%" },
    { name: "LLM Think", type: "ai", icon: <Box size={24} />, x: "42%" },
    { name: "Tool Call", type: "action", icon: <Layers size={24} />, x: "58%" },
    { name: "Validation", type: "check", icon: <Terminal size={24} />, x: "74%" },
    { name: "Output", type: "result", icon: <ExternalLink size={24} />, x: "90%" }
  ];

  return (
    <section className="arch-showcase-section">
      <div className="section-header centered">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="section-tag"
        >
          ENGINEERING PATTERN
        </motion.span>
        <h2 className="section-title gradient-text">Autonomous Agent Architecture</h2>
      </div>

      <div className="arch-canvas-premium glass-card">


        {/* Connection Paths */}
        <svg className="arch-connection-svg" viewBox="0 0 1000 300">
          <path
            id="mainFlow"
            d="M 100 150 C 250 150, 250 150, 400 150 C 550 150, 550 150, 700 150 C 850 150, 850 150, 900 150"
            className="flow-path"
          />

          {/* Pulsing Data Particles */}
          {[...Array(3)].map((_, i) => (
            <circle key={i} r="4" className="data-pulse pulse-particle">
              <animateMotion
                dur={`${4 + i}s`}
                repeatCount="indefinite"
                path="M 100 150 C 250 150, 250 150, 400 150 C 550 150, 550 150, 700 150 C 850 150, 850 150, 900 150"
                begin={`${i * 1.5}s`}
              />
            </circle>
          ))}
        </svg>

        {nodes.map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className="arch-node-premium"
          >
            <Tilt>
              <div className="node-icon-premium">
                {node.icon}
              </div>
            </Tilt>
            <h4>{node.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const InteractiveDemo = () => {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeNode, setActiveNode] = useState(-1);
  const [completedNodes, setCompletedNodes] = useState([]);

  const workflowNodes = [
    { name: "Trigger", type: "webhook", icon: <Zap size={16} />, log: "Webhook triggered: Agentic Loop Start..." },
    { name: "AI Agent", type: "ai", icon: <Cpu size={16} />, log: "Node: LLM Reasoning -> Agent thinking..." },
    { name: "Database", type: "action", icon: <Database size={16} />, log: "Agent identified tool: 'Database Retrieval'" },
    { name: "Verification", type: "check", icon: <Terminal size={16} />, log: "Node: Validate Result -> Output Verified" },
    { name: "Slack", type: "result", icon: <ExternalLink size={16} />, log: "n8n Workflow Complete: Action Taken." }
  ];

  const runSim = () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setActiveNode(-1);
    setCompletedNodes([]);

    workflowNodes.forEach((node, i) => {
      setTimeout(() => {
        setActiveNode(i);
        setLogs(prev => [...prev, node.log]);

        if (i > 0) {
          setCompletedNodes(prev => [...prev, i - 1]);
        }

        if (i === workflowNodes.length - 1) {
          setTimeout(() => {
            setActiveNode(-1);
            setCompletedNodes(prev => [...prev, i]);
            setRunning(false);
          }, 800);
        }
      }, i * 1200);
    });
  };

  return (
    <section id="demo" className="demo-section">
      <div className="section-header centered">
        <span className="section-tag">LIVE EXECUTION</span>
        <h2 className="section-title gradient-text">Run n8n Automation</h2>
      </div>

      <div className="demo-container glass-card">
        <div className="workflow-canvas-demo">
          <div className="nodes-lane">
            {workflowNodes.map((node, i) => (
              <div key={i} className="demo-node-wrapper">
                <motion.div
                  animate={{
                    scale: activeNode === i ? 1.1 : 1,
                    borderColor: activeNode === i ? "var(--accent)" : completedNodes.includes(i) ? "#27c93f" : "rgba(255,255,255,0.1)",
                    boxShadow: activeNode === i ? "0 0 30px var(--accent-glow)" : "none"
                  }}
                  className={`demo-node node-${node.type} ${activeNode === i ? 'active' : ''} ${completedNodes.includes(i) ? 'completed' : ''}`}
                >
                  <div className="node-status-dot"></div>
                  <div className="node-icon">{node.icon}</div>
                  <span className="node-name">{node.name}</span>
                </motion.div>
                {i < workflowNodes.length - 1 && (
                  <div className="demo-connector">
                    <motion.div
                      className="connector-progress"
                      initial={{ width: 0 }}
                      animate={{ width: completedNodes.includes(i) ? "100%" : 0 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="demo-controls-compact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runSim}
              className={`btn btn-primary ${running ? 'loading' : ''}`}
              disabled={running}
            >
              {running ? "Workflow Running..." : "Execute Workflow"}
            </motion.button>
          </div>
        </div>

        <div className="demo-terminal-compact">
          <div className="terminal-top">
            <div className="t-dot red"></div>
            <div className="t-dot yellow"></div>
            <div className="t-dot green"></div>
            <span>execution_output.log</span>
          </div>
          <div className="terminal-body scrollable">
            {logs.length === 0 && <span className="line placeholder"># Click execute to run n8n workflow...</span>}
            {logs.map((log, i) => (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className="line"
              >
                <span className="neon-text">$</span> {log}
              </motion.p>
            ))}
            {activeNode !== -1 && <div className="typing-cursor"></div>}
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Team Lead @ GenLab",
      text: "His ability to architect autonomous loops with n8n at such a high level of reliability is impressive. A true asset to any AI-forward team.",
      verified: true
    },
    {
      name: "Project Supervisor",
      text: "The AgriSafe system demonstrated a rare combination of blockchain security and AI reasoning. Exceptional technical vision.",
      verified: true
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header centered">
        <span className="section-tag">07 // SOCIAL PROOF</span>
        <h2 className="section-title gradient-text">Industry Endorsements</h2>
      </div>
      <div className="testimonials-grid">
        {reviews.map((r, i) => (
          <motion.div key={i} className="glass-card testimonial-card">
            <div className="shimmer-wrapper"><div className="shimmer"></div></div>
            <p className="quote">"{r.text}"</p>
            <div className="author">
              <span className="author-name">{r.name}</span>
              {r.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Insights = () => {
  const posts = [
    {
      title: "n8n vs LangChain",
      category: "Automation",
      readTime: "3 min read",
      desc: "Why visual workflow builders are winning the production deployment race for Agentic AI."
    },
    {
      title: "Agentic Error Handling",
      category: "Best Practice",
      readTime: "5 min read",
      desc: "Preventing LLM hallucination loops in business-critical automation workflows."
    }
  ];

  return (
    <section className="insights-section">
      <div className="section-header">
        <span className="section-tag">08 // KNOWLEDGE</span>
        <h2 className="section-title gradient-text">System Insights</h2>
      </div>
      <div className="insights-grid">
        {posts.map((post, i) => (
          <motion.div key={i} className="glass-card insight-card">
            <div className="shimmer-wrapper"><div className="shimmer"></div></div>
            <span className="post-meta">{post.category} • {post.readTime}</span>
            <h3>{post.title}</h3>
            <p>{post.desc}</p>
            <button className="btn-text neon-text">Read Article →</button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="contact-section">
    <div className="footer-line"></div>
    <div className="contact-grid">
      <div className="contact-brand">
        <h2 className="neon-text">VEILU KANTHA MOORTHY . K</h2>
        <p>AI Engineer & Mentor | Open for Projects.</p>
        <div className="contact-meta">
          <div className="meta-item"><MapPin size={16} /> Nagercoil, Tamil Nadu</div>
          <div className="meta-item"><Mail size={16} /> veilukanthamoorthysan10@gmail.com</div>
          <div className="meta-item"><ExternalLink size={16} /> +91 9489371066</div>
        </div>
      </div>
      <div className="contact-socials">
        {[
          { icon: <Linkedin />, label: "LinkedIn", link: "https://linkedin.com/in/moorthyvk" },
          { icon: <Github />, label: "GitHub", link: "https://github.com/moorthyvk" }
        ].map(s => (
          <motion.a
            key={s.label}
            whileHover={{ y: -5, color: "var(--accent)" }}
            href={s.link}
            className="social-link"
          >
            {s.icon} <span>{s.label}</span>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

const Experience = () => {
  const experiences = [
    {
      role: "AI Automation Engineer",
      company: "GENLAB",
      period: "MAY 2025 - PRESENT",
      points: [
        "Designed and deployed agentic AI workflows using LLMs.",
        "Built multi-step automation pipelines using n8n.",
        "Integrated APIs, webhooks, and third-party services.",
        "Implemented prompt engineering and response validation."
      ]
    },
    {
      role: "Data Engineer & Tech Trainer",
      company: "GenLab",
      period: "Previous",
      points: [
        "Built and maintained ETL pipelines for structured datasets.",
        "Supported data warehouse updates and monitoring.",
        "Automated internal workflows to reduce manual effort."
      ]
    }
  ];

  const education = [
    {
      degree: "Bachelor of Computer Science & Engineering",
      inst: "Panimalar Engineering College, Chennai",
      period: "2022 - 2025",
      grade: "CGPA 79.6"
    },
    {
      degree: "Diploma in Electrical & Electronics Engineering",
      inst: "Cape Polytechnic College, Aralvoimozhi",
      period: "2019 - 2022",
      grade: "CGPA 86.7"
    }
  ];

  return (
    <section id="experience" className="experience-section">
      <div className="section-header">
        <span className="section-tag">06 // JOURNEY</span>
        <h2 className="section-title gradient-text">Experience & Education</h2>
      </div>

      <div className="exp-edu-grid">
        <div className="exp-column">
          <h3 className="column-title neon-text">Professional Experience</h3>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="timeline-item glass-card"
              >
                <div className="shimmer-wrapper"><div className="shimmer"></div></div>
                <div className="item-header">
                  <h4>{exp.role}</h4>
                  <span className="item-period">{exp.period}</span>
                </div>
                <p className="item-company">{exp.company}</p>
                <ul className="item-points">
                  {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="edu-column">
          <h3 className="column-title neon-text">Academic Foundation</h3>
          <div className="edu-list">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="edu-item glass-card"
              >
                <div className="shimmer-wrapper"><div className="shimmer"></div></div>
                <div className="item-header">
                  <h4>{edu.degree}</h4>
                  <span className="item-period">{edu.period}</span>
                </div>
                <p className="item-inst">{edu.inst}</p>
                <span className="item-grade neon-text">{edu.grade}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Activate Smooth Scroll
  useSmoothScroll();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="app-main">
      <motion.div
        className="scroll-progress"
        style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)', transformOrigin: '0%', zIndex: 2000 }}
      />
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <CustomCursor />
          <div className="bg-overlay">
            <div className="mesh-gradient"></div>
            <div className="grain-overlay"></div>
            <div className="grid-background"></div>

            {/* High-end Ambient Light Blobs */}
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
            <div className="ambient-blob blob-3"></div>
          </div>

          <ParticleBackground />
          <motion.div
            className="cursor-glow-custom"
            animate={{
              left: mousePos.x,
              top: mousePos.y
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.3 }}
          />

          <Navbar />

          <main className="content-wrapper">
            <Hero />
            <TechMarquee />
            <About />
            <Methodology />
            <ArchitectureShowcase />
            <InteractiveDemo />
            <ToolsGrid />
            <Services />
            <Expertise />
            <Experience />
            <Testimonials />
            <Insights />
            <Contact />
          </main>

          <footer className="footer-bottom">
            <p>© 2024 AI SYSTEMS ARCHITECT. CREATED WITH PRECISION.</p>
          </footer>
        </motion.div>
      )}
    </div>
  );
};

export default App;

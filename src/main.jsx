import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import ElectricBorder from './ElectricBorder'

const heroVideos = ['/assets/hero-showcase.mp4', '/assets/hero-short-clip.mp4', '/assets/hero-star-road.mp4']
const projectMedia = {
  '01': [{ source: '/assets/project-spaceship.mp4', kind: 'video' }, { source: '/assets/project-mecha-dog.mp4', kind: 'video' }, { source: '/assets/project-thirty-seconds.mp4', kind: 'video' }],
  '02': [{ source: '/assets/campus-ai-work.mp4', kind: 'video' }, { source: '/assets/campus-shen-sui.mp4', kind: 'video' }],
  '03': Array.from({ length: 20 }, (_, index) => ({ source: `/assets/ai-gallery-${index + 1}.png`, kind: 'image' })),
}
const projects = [
  { id: '01', type: 'VISUAL SYSTEM / MOTION', title: 'AI MOTION NARRATIVE', body: 'Concept, motion and visual storytelling with AI assisted production.' },
  { id: '02', type: 'CAMPUS AI / SELECTED WORK', title: 'CAMPUS AI WORKS', body: 'Selected AI visual experiments created through campus practice.' },
  { id: '03', type: 'AI IMAGE / COLLECTION', title: 'AI IMAGE COLLECTION', body: 'Twenty AI image studies across character, world and atmosphere.' },
]
const capabilities = [
  ['01', 'AI CONTENT PRODUCTION', 'From concept and storyboard to generated assets and delivery.'],
  ['02', 'VISUAL CREATION', 'Characters, environments and a consistent visual language.'],
  ['03', 'MOTION WORKFLOW', 'Visual assets shaped for motion and production pipelines.'],
  ['04', 'TEAM COLLABORATION', 'Reusable systems for faster creative collaboration.'],
]
const Arrow = () => <span className="arrow">-&gt;</span>

function App() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [heroScan, setHeroScan] = useState(false)
  const [nameScan, setNameScan] = useState(false)
  const [toast, setToast] = useState('')
  const [playerOpen, setPlayerOpen] = useState(false)
  const [projectKey, setProjectKey] = useState('01')
  const [mediaIndex, setMediaIndex] = useState(0)
  const playerRef = useRef(null)
  const wheelLock = useRef(false)
  const items = projectMedia[projectKey]
  const current = items[mediaIndex]
  const nodes = items.length <= 5 ? items.map((_, index) => index) : Array.from({ length: 5 }, (_, offset) => Math.max(0, Math.min(mediaIndex - 2, items.length - 5)) + offset)

  useEffect(() => {
    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.45
      const ids = ['about', 'work', 'ability']
      setActiveSection(ids.reduce((currentId, id) => {
        const node = document.getElementById(id)
        return node && node.offsetTop <= marker ? id : currentId
      }, ''))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const copyEmail = async () => { try { await navigator.clipboard.writeText('13662852993@163.com') } catch {} ; notify('Email copied. Contact Wangyin anytime.') }
  const triggerHero = () => { setHeroScan(false); requestAnimationFrame(() => { setHeroScan(true); window.setTimeout(() => setHeroScan(false), 980) }) }
  const triggerName = () => { setNameScan(false); requestAnimationFrame(() => { setNameScan(true); window.setTimeout(() => setNameScan(false), 1300) }) }
  const openProject = (id) => { setProjectKey(id); setMediaIndex(0); setPlayerOpen(true) }
  const closeProject = () => { playerRef.current?.pause(); setPlayerOpen(false) }
  const changeMedia = (direction) => {
    if (wheelLock.current) return
    wheelLock.current = true
    playerRef.current?.pause()
    setMediaIndex((index) => (index + direction + items.length) % items.length)
    window.setTimeout(() => { wheelLock.current = false }, 580)
  }

  return <main>
    {toast && <div className="copy-toast" role="status">{toast}</div>}
    {playerOpen && <div className="project-player" role="dialog" aria-modal="true" onWheel={(event) => { event.preventDefault(); if (Math.abs(event.deltaY) > 10) changeMedia(event.deltaY > 0 ? 1 : -1) }}>
      <div className="project-player-backdrop" onClick={closeProject} />
      <div className="project-player-window">
        <header><span>{current.kind === 'image' ? 'AI GALLERY' : 'PROJECT REEL'} / {String(mediaIndex + 1).padStart(2, '0')}</span><button type="button" onClick={closeProject}>CLOSE X</button></header>
        <div className="project-player-media" onContextMenu={(event) => event.preventDefault()}>
          {current.kind === 'image' ? <img src={current.source} alt="Project artwork" draggable={false} onContextMenu={(event) => event.preventDefault()} /> : <video ref={playerRef} key={current.source} src={current.source} autoPlay muted playsInline controls controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture draggable={false} onContextMenu={(event) => event.preventDefault()} />}
        </div>
        <footer><div className="project-player-hint">USE MOUSE WHEEL TO SWITCH MEDIA</div><div className="project-player-progress"><i style={{ width: `${((mediaIndex + 1) / items.length) * 100}%` }} />{nodes.map((index) => <button key={index} type="button" className={index === mediaIndex ? 'is-active' : ''} onClick={() => { playerRef.current?.pause(); setMediaIndex(index) }} />)}</div></footer>
      </div>
    </div>}

    <section className="hero" id="top">
      <video className="hero-video-showcase" key={heroIndex} autoPlay muted playsInline onEnded={() => setHeroIndex((index) => (index + 1) % heroVideos.length)}><source src={heroVideos[heroIndex]} type="video/mp4" /></video>
      <div className="hero-art hero-finish" aria-hidden="true"><div className="hero-grain" /></div>
      <nav className="nav shell"><a className="wordmark" href="#top">UNWIKL'S WORD</a><div className="nav-links"><a className={activeSection === 'about' ? 'is-active' : ''} href="#about">ABOUT</a><a className={activeSection === 'work' ? 'is-active' : ''} href="#work">WORK</a><a className={activeSection === 'ability' ? 'is-active' : ''} href="#ability">SYSTEM</a></div><a className="contact-pill" href="mailto:13662852993@163.com">CONTACT <Arrow /></a></nav>
      <div className={'hero-signature ' + (heroScan ? 'is-scanning' : '')}><p onPointerLeave={triggerHero}>{['W','A','N','G','Y','I','N'].map((letter, index) => <span data-letter={letter} key={letter + index}>{letter}</span>)}</p><small>You can also call me Unwikl</small></div>
      <aside className="hero-notes"><div className="hero-actions"><a className="hero-action hero-action-primary" href="#about">START <Arrow /></a><button className="hero-action hero-action-mail" type="button" onClick={copyEmail}>13662852993@163.com</button></div><p className="hero-statement">HUMAN CREATIVITY <span>X</span> ARTIFICIAL INTELLIGENCE</p></aside>
    </section>

    <section className="about section shell" id="about"><div className="section-label"><span>01</span> PROFILE</div><div className="about-grid">
      <ElectricBorder className="portrait-panel" color="#b68aff"><div className="portrait-wrap"><img src="/assets/wangyin-photo.png" alt="Wangyin portrait" draggable={false} onContextMenu={(event) => event.preventDefault()} /><div className="portrait-mark">Unwikl</div></div><p className="portrait-intent">AI DESIGNER | AI PRODUCER | AI DIRECTOR</p></ElectricBorder>
      <div className="about-copy"><div className="about-intro"><p className="eyebrow">HELLO, I'M</p><h2 className={'about-name ' + (nameScan ? 'is-scanning' : '')} onPointerLeave={triggerName}><span className="name-letter" data-letter="W">WANG</span><span className="name-letter" data-letter="Y">YIN</span><span className="about-role" data-role="AI Designer">AI Designer</span></h2><p className="intro">AI designer focused on content production, visual creation, animation workflow and collaborative systems.</p></div><div className="education"><span>EDUCATION</span><div><b>2022.09 - 2026.07</b><b>SOUTH CHINA AGRICULTURAL UNIVERSITY</b><b>ANIMATION</b><b>BACHELOR</b></div></div><div className="contact-lines"><button className="contact-copy" type="button" onClick={() => notify('WeChat signal saved. Search Unwikl.') }><span>WECHAT</span>Unwikl</button><button className="contact-copy" type="button" onClick={copyEmail}><span>MAIL</span>13662852993@163.com</button><p><span>BASED IN</span>GUANGZHOU / CHINA</p></div></div>
    </div></section>

    <section className="works section" id="work"><div className="shell"><div className="works-heading"><div className="section-label"><span>02</span> SELECTED WORK</div><h2>SELECTED WORK</h2><p>ALL WORKS ARE FOR PORTFOLIO PRESENTATION ONLY</p></div><div className="project-list">{projects.map((project) => <ElectricBorder className="project-case-panel" color="#b68aff" key={project.id}><article className="project-case"><div className="project-video-slot"><div className="project-video-grid" /><span className="video-index">{project.id}</span><div className="video-placeholder"><i>PLAY</i><p>PROJECT MEDIA<br />SCROLL TO VIEW</p></div></div><div className="project-case-copy"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-summary">{project.body}</p><button type="button" className="project-detail" onClick={() => openProject(project.id)}>VIEW PROJECT <Arrow /></button></div></article></ElectricBorder>)}</div></div></section>

    <section className="ability section shell" id="ability"><div className="ability-header"><div className="section-label"><span>03</span> WHAT I DO</div><h2>CREATIVE<br />SYSTEMS</h2></div><div className="capability-list">{capabilities.map(([number, title, body]) => <ElectricBorder className="capability-panel" color="#b68aff" key={number}><article className="capability"><span className="cap-number">{number}</span><h3>{title}</h3><p>{body}</p><Arrow /></article></ElectricBorder>)}</div><ElectricBorder className="tool-panel" color="#b68aff"><div className="tool-strip"><span>TOOLS I USE</span><p>ChatGPT X ComfyUI X Midjourney X AE</p></div></ElectricBorder></section>

    <section className="footer-cta" id="contact"><div className="footer-noise" /><div className="shell footer-inner"><p className="eyebrow">START A CONVERSATION</p><h2>LET'S CREATE<br /><em>THE NEXT STORY.</em></h2><button className="email-link" type="button" onClick={copyEmail}>13662852993@163.com <Arrow /></button><div className="footer-line"><span>2026 WANGYIN</span><a href="#top">BACK TO TOP</a><span>AI DESIGNER / GUANGZHOU</span></div></div></section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)